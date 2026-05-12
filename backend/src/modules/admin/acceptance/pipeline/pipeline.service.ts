import { Injectable, Logger } from '@nestjs/common';
import { AcceptanceStatus } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ACCEPTANCE_CONSTANTS } from '../constants/acceptance.constants';

import { LocationFlaggingStrategy } from '../strategies/flagging/location.flagging';
import { FeeExpelledFlaggingStrategy } from '../strategies/flagging/fee-expelled.flagging';
import { PunishmentFlaggingStrategy } from '../strategies/flagging/punishment.flagging';
import { EnrolledOnlyFlaggingStrategy } from '../strategies/flagging/enrolled-only.flagging';
import { FailedSubjectsFlaggingStrategy } from '../strategies/flagging/failed-subjects.flagging';
import { MissingGradeFlaggingStrategy } from '../strategies/flagging/missing-grade.flagging';
import { NewStudentRankingStrategy } from '../strategies/ranking/new-students.ranking';
import { ReturningStudentRankingStrategy } from '../strategies/ranking/returning-students.ranking';
import { StudentRankedDto } from '../strategies/flagging/base-flagging.strategy';

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);

  private readonly flaggingStrategies = [
    new LocationFlaggingStrategy(),
    new FeeExpelledFlaggingStrategy(),
    new PunishmentFlaggingStrategy(),
    new EnrolledOnlyFlaggingStrategy(),
    new FailedSubjectsFlaggingStrategy(),
    new MissingGradeFlaggingStrategy(),
  ];

  private readonly newStudentRanking = new NewStudentRankingStrategy();
  private readonly returningStudentRanking = new ReturningStudentRankingStrategy();

  constructor(private readonly prisma: PrismaService) {}

  async hasPipelineRun(phaseId: number): Promise<boolean> {
    const record = await this.prisma.studentApplication.findFirst({
      where: {
        phaseId,
        systemRecommendation: { not: null },
      },
      select: { id: true },
    });
    return record !== null;
  }

  // ================= HELPER METHODS =================
  private isFilled(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  public isCompletedStudent(student: any): boolean {
    const qualificationValid =
      student.is_new === false || student.qualificationId !== null;

    let egyptianFieldsValid = false;
    if (student.isEgyptian === true) {
      egyptianFieldsValid =
        this.isFilled(student.parentsStatus) &&
        this.isFilled(student.guardianNationalId);
    } else if (student.isEgyptian === false) {
      egyptianFieldsValid =
        !this.isFilled(student.parentsStatus) &&
        !this.isFilled(student.guardianNationalId);
    }

    const baseValid =
      student.is_new !== null &&
      student.is_inside_egypt !== null &&
      student.isEgyptian !== null &&
      student.residencyInfoCompleted === true &&
      student.academicInfoCompleted === true &&
      student.dormType !== null &&
      !!student.medicalReviews;

    return baseValid && qualificationValid && egyptianFieldsValid;
  }

  async runPipeline(applicationDateId: number): Promise<void> {
    this.logger.log(`Starting acceptance pipeline for phase: ${applicationDateId}`);

    // ── STEP 0: Fetch the phase ──────────────────────────────────────────────
    const phase = await this.prisma.applicationDate.findUnique({
      where: { id: applicationDateId },
    });

    if (!phase) {
      this.logger.warn(`Phase ${applicationDateId} not found. Aborting.`);
      return;
    }

    // ── STEP 1: Auto-create missing StudentApplication records ───────────────
    const isNewFilter =
      phase.studentType === 'new'
        ? true
        : phase.studentType === 'old'
        ? false
        : undefined; // 'all' → no filter on is_new

    const candidates = await this.prisma.student.findMany({
      where: {
        applied_at: {
          gte: phase.startAt,
          lte: phase.endAt,
        },
        ...(isNewFilter !== undefined ? { is_new: isNewFilter } : {}),
      },
      include: {
        governorate: true,
        city: true,
        qualification: true,
        medicalReviews: true, // ✅ Fixed: Removed orderBy and _count
        policeDepartment: true,      
        educationalDepartment: true, 
      },
    });

    const completedCandidates = candidates.filter(s => this.isCompletedStudent(s));

    // Fetch existing applications for this phase to avoid duplicates
    const existingApplications = await this.prisma.studentApplication.findMany({
      where: { phaseId: applicationDateId },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingApplications.map(a => a.studentId));

    const toCreate = completedCandidates.filter(s => !existingStudentIds.has(s.id));

    if (toCreate.length > 0) {
      await this.prisma.studentApplication.createMany({
        data: toCreate.map(s => ({
          studentId: s.id,
          phaseId: applicationDateId,
          status: AcceptanceStatus.pending,
        })),
        skipDuplicates: true,
      });
      this.logger.log(`Auto-created ${toCreate.length} applications for phase ${applicationDateId}`);
    }

    // ── STEP 2: Idempotency guard (existing logic) ───────────────────────────
    const alreadyProcessed = await this.prisma.studentApplication.findFirst({
      where: {
        phaseId: applicationDateId,
        systemRecommendation: { not: null },
      },
      select: { id: true },
    });

    if (alreadyProcessed) {
      this.logger.warn(`Pipeline already ran for phase ${applicationDateId}. Skipping.`);
      return;
    }

    // ── STEP 3: Rest of existing pipeline logic ──────────────────────────────
    const applications = await this.prisma.studentApplication.findMany({
      where: {
        phaseId: applicationDateId,
        status: AcceptanceStatus.pending,
      },
      include: {
        student: {
          include: {
            governorate: true,
            city: true,
            qualification: true,
            medicalReviews: true, // ✅ Fixed: Removed orderBy and _count
            policeDepartment: true,      
            educationalDepartment: true, 
          },
        },
      },
    });

    const validApplications = applications.filter(app =>
      this.isCompletedStudent(app.student)
    );

    this.logger.log(
      `Phase ${applicationDateId}: ${applications.length} total, ${validApplications.length} complete.`,
    );

    if (validApplications.length === 0) {
      this.logger.log(`No complete applications found for phase ${applicationDateId}. Exiting.`);
      return;
    }

    const segmentMap: Record<string, typeof validApplications> = {
      'male-new': [],
      'male-returning': [],
      'female-new': [],
      'female-returning': [],
    };

    for (const app of validApplications) {
      const genderStr = app.student.gender === 'male' ? 'male' : 'female';
      const typeStr = app.student.is_new ? 'new' : 'returning';
      const key = `${genderStr}-${typeStr}`;
      if (segmentMap[key]) segmentMap[key].push(app);
    }

    for (const [segmentName, segmentApps] of Object.entries(segmentMap)) {
      if (segmentApps.length === 0) continue;
      this.logger.log(`Processing segment [${segmentName}] — ${segmentApps.length} students`);
      await this.runSegment(segmentApps, segmentName, applicationDateId);
    }

    this.logger.log(`Pipeline completed for phase: ${applicationDateId}`);
  }

  private async runSegment(
    applications: any[],
    segment: string,
    applicationDateId: number,
  ): Promise<void> {
    const isNew = segment.includes('new');

    const students: StudentRankedDto[] = applications.map((app) => ({
      ...app.student,
      applicationId: app.id,
      _flagReasons: [],
      _systemRecommendation: null,
      _rankScore: 0,
      _rankPosition: 0,
    }));

    // 1. Apply flagging strategies
    for (const student of students) {
      for (const strategy of this.flaggingStrategies) {
        strategy.apply(student);
      }
    }

    // 2. Split into excluded and rankable buckets
    const excluded = students.filter((s) => s._systemRecommendation === 'rejected');
    const toRank = students.filter((s) => s._systemRecommendation !== 'rejected');

    // 3. Rank
    const rankingStrategy = isNew ? this.newStudentRanking : this.returningStudentRanking;
    const rankedStudents = rankingStrategy.rank(toRank);

    // 4. Set final recommendations
    for (const student of rankedStudents) {
      if (student._systemRecommendation === null && student._flagReasons.length === 0) {
        student._systemRecommendation = 'accepted';
      } else {
        student._systemRecommendation = 'review';
      }
    }

    // 5. Sort and merge
    const egyptianFirst = (a: StudentRankedDto, b: StudentRankedDto) =>
      (b.nationalId ? 1 : 0) - (a.nationalId ? 1 : 0);

    const rankThenNationality = (a: StudentRankedDto, b: StudentRankedDto) =>
      a._rankPosition !== b._rankPosition
        ? a._rankPosition - b._rankPosition
        : egyptianFirst(a, b);

    const finalOrderedList = [
      ...rankedStudents.filter((s) => s._systemRecommendation === 'accepted').sort(rankThenNationality),
      ...rankedStudents.filter((s) => s._systemRecommendation === 'review').sort(rankThenNationality),
      ...excluded.sort(egyptianFirst),
    ];

    // 6. Chunked DB update — persist systemRecommendation, rankScore, and flagReasons
    const updateOperations = finalOrderedList.map((student) =>
      this.prisma.studentApplication.update({
        where: {
          studentId_phaseId: {
            studentId: student.id,
            phaseId: applicationDateId,
          },
        },
        data: {
          systemRecommendation: student._systemRecommendation,
          flagReasons: student._flagReasons.length > 0
            ? student._flagReasons.join(' | ')
            : null,
        },
      }),
    );

    for (let i = 0; i < updateOperations.length; i += ACCEPTANCE_CONSTANTS.PIPELINE.CHUNK_SIZE) {
      await this.prisma.$transaction(updateOperations.slice(i, i + ACCEPTANCE_CONSTANTS.PIPELINE.CHUNK_SIZE));
    }

    this.logger.log(`Segment [${segment}] done — ${finalOrderedList.length} students updated.`);
  }
}