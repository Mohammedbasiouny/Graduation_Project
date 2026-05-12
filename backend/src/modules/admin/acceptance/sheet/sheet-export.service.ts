import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AiTaskService } from '../security/security.service';
import { buildWorkbook } from './excel.helper';
import { StudentRankedDto } from '../strategies/flagging/base-flagging.strategy';
import * as AdmZip from 'adm-zip';
import { ACCEPTANCE_CONSTANTS } from '../constants/acceptance.constants';
import { DownloadPhaseDto } from '../dto';

@Injectable()
export class SheetExportService {
  private readonly logger = new Logger(SheetExportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiTaskService: AiTaskService,
  ) {}

  async exportPhaseSheetsToBuffer(
    applicationDateId: number,
    adminUserId: number,
    dto: DownloadPhaseDto,
  ): Promise<{ buffer: Buffer; fileName: string } | null> {
    // 1. Fetch already-processed applications from DB
    const applications = await this.prisma.studentApplication.findMany({
      where: {
        phaseId: applicationDateId,
        systemRecommendation: { not: null },
      },
      include: {
        student: {
          include: {
            governorate: true,
            city: true,
            qualification: true,
            medicalReviews: true,
            faculty: true,
            highSchoolGovernorateRel: true,
            user: { select: { full_name: true } },
            policeDepartment: true,      
            educationalDepartment: true,
          },
        },
      },
    });

    if (applications.length === 0) {
      this.logger.warn(`No processed applications found for phase ${applicationDateId}.`);
      return null;
    }

    const RECOMMENDATION_ORDER: Record<string, number> = {
      accepted: 0,
      review: 1,
      rejected: 2,
    };

    applications.sort((a, b) => {
      const aOrder = RECOMMENDATION_ORDER[a.systemRecommendation ?? ''] ?? 3;
      const bOrder = RECOMMENDATION_ORDER[b.systemRecommendation ?? ''] ?? 3;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (b.student.highSchoolTotalGrade ?? 0) - (a.student.highSchoolTotalGrade ?? 0);
    });

    // 2. Segment students and map to DTOs — flagReasons read from DB, no re-running strategies
    const segmentMap: Record<string, StudentRankedDto[]> = {
      'male-new': [],
      'male-returning': [],
      'female-new': [],
      'female-returning': [],
    };

    for (const app of applications) {
      const studentDto: StudentRankedDto = {
        ...app.student,
        applicationId: app.id,
        _systemRecommendation: app.systemRecommendation as StudentRankedDto['_systemRecommendation'],
        _rankPosition: 0,
        _flagReasons: app.flagReasons ? app.flagReasons.split(' | ') : [],
      };

      const genderStr = app.student.gender === 'male' ? 'male' : 'female';
      const typeStr = app.student.is_new ? 'new' : 'returning';
      const key = `${genderStr}-${typeStr}`;
      if (segmentMap[key]) segmentMap[key].push(studentDto);
    }

    // 3. Assign rank positions per segment based on rankScore order
    for (const students of Object.values(segmentMap)) {
      students.forEach((s, idx) => {
        s._rankPosition = idx + 1;
      });
    }

    // 4. Build Excel files and zip in memory
    const zip = new AdmZip();
    const excelNames = ACCEPTANCE_CONSTANTS.EXPORT.EXCEL_FILE_NAMES as Record<string, string>;
    const securityNames = ACCEPTANCE_CONSTANTS.EXPORT.SECURITY_FILE_NAMES as Record<string, string>;

    for (const [segment, students] of Object.entries(segmentMap)) {
      if (students.length === 0) continue;

      const isNew = segment.includes('new');
      const excelFileName = `${excelNames[segment] ?? 'قائمة_المرحلة'}_${applicationDateId}.xlsx`;
      const excelBuffer = await buildWorkbook(students, segment, String(applicationDateId), isNew);
      zip.addFile(excelFileName, excelBuffer);
    }

    if (zip.getEntries().length === 0) {
      this.logger.warn(`No valid segments to export for phase ${applicationDateId}.`);
      return null;
    }

    // 5. Generate final zip buffer
    const finalZipBuffer = zip.toBuffer();
    const finalZipFileName = `كشوف_المرحلة_${applicationDateId}.zip`;

    // 6. Persist audit record
    await this.prisma.acceptanceSheetExport.create({
      data: {
        phaseId: applicationDateId,
        exportedBy: adminUserId,
      },
    });

    if (dto.need_processed_national_ids) {
      // 7. Fire AI security tasks per segment — silent failure per segment
      for (const [segment, students] of Object.entries(segmentMap)) {
        if (students.length === 0) continue;
  
        const securityArray = students
          .filter((s) => s.nationalId != null)
          .map((s) => ({
            id: s._rankPosition,
            ssn: s.nationalId as string,
            student_id: s.id,
          }));
  
        if (securityArray.length === 0) {
          this.logger.warn(`No Egyptian students in segment [${segment}], skipping AI task.`);
          continue;
        }
  
        const securityFileName = `${securityNames[segment] ?? 'الاستعلام_الامني_المرحلة'}_${applicationDateId}.zip`;
  
        try {
          await this.aiTaskService.generateStudentsAiTask(securityArray, adminUserId, securityFileName);
          this.logger.log(`AI security task fired for segment [${segment}].`);
        } catch (error: any) {
          this.logger.error(
            `AI security task failed for segment [${segment}]: ${error.message}`,
            error.stack,
          );
        }
      }
    }

    // 8. Return buffer and filename to controller
    return { buffer: finalZipBuffer, fileName: finalZipFileName };
  }
}