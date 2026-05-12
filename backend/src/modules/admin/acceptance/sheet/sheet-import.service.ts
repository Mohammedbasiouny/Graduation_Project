import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { parseImportedSheet } from './excel.helper';
import { I18nService, I18nContext } from 'nestjs-i18n';
import * as i18n from '../../../../i18n/ar/acceptance.json';
import { ACCEPTANCE_CONSTANTS } from '../constants/acceptance.constants';

@Injectable()
export class SheetImportService {
  private readonly logger = new Logger(SheetImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  private throw422(message: string) {
    throw new UnprocessableEntityException({
      success: false,
      message: 'Validation error',
      errors: {
        file: [message],
      },
    });
  }

  // Maps i18n text -> true/false/null
  private mapSecurityStatus(value: string): boolean | null {
    if (value === (i18n.sheet as any).statuses.accepted) return true;
    if (value === (i18n.sheet as any).statuses.rejected) return false;
    return null; 
  }

  // Maps i18n text -> string enum
  private mapAdminDecision(value: string): string {
    if (value === (i18n.sheet as any).statuses.accepted) return 'accepted';
    if (value === (i18n.sheet as any).statuses.rejected) return 'rejected';
    return 'pending'; 
  }

  async importStudentMessages(
    file: Express.Multer.File,
    phaseId: number,
  ): Promise<{ updated: number }> {
    
    // ==========================================================
    // PHASE 1: STRICT VALIDATION (NO DB CHANGES)
    // ==========================================================
    
    if (!file) this.throw422('File is missing or not provided');
    if (!file.originalname.match(/\.xlsx$/i)) this.throw422('Invalid file type. Only .xlsx files are allowed');
    if (file.size === 0) this.throw422('File is empty');

    const applicationDateExists = await this.prisma.studentApplication.findFirst({
      where: { phaseId },
    });

    if (!applicationDateExists) this.throw422('Application date not found');

    let rows: { studentId: string; securityStatus: string; adminDecision: string; message: string }[] = [];
    try {
      rows = await parseImportedSheet(file.buffer);
    } catch (e: any) {
      if (e.message === 'MISSING_COLUMNS') this.throw422('Missing required columns');
      this.throw422('Unable to read Excel file');
    }

    if (rows.length === 0) return { updated: 0 };

    // Check for Duplicates
    const rowStudentIds = rows.map((r) => r.studentId);
    const uniqueStudentIds = new Set(rowStudentIds);
    if (rowStudentIds.length !== uniqueStudentIds.size) {
      this.throw422('Duplicate student ids found in file');
    }

    // Dynamic valid statuses from JSON
    const validStatuses = [
      (i18n.sheet as any).statuses.accepted,
      (i18n.sheet as any).statuses.rejected,
      (i18n.sheet as any).statuses.pending,
    ];

    // Strict Validation: Check for empty fields and valid statuses
    for (const row of rows) {
      const secStatus = row.securityStatus?.trim();
      const adminDec = row.adminDecision?.trim();
      const msg = row.message?.trim();

      // 1. Check that NO fields are blank
      if (!secStatus || !adminDec || !msg) {
        this.throw422(`بيانات غير مكتملة للطالب رقم ${row.studentId}. يجب تعبئة كافة أعمدة حالة الاستعلام الأمني، قرار الإدارة، وأسباب القبول/الرفض.`);
      }

      // 2. Check that the provided statuses are valid against i18n
      if (!validStatuses.includes(secStatus)) {
        this.throw422(`قيمة غير صالحة في عمود حالة الاستعلام الامني للطالب رقم ${row.studentId}: ${row.securityStatus}`);
      }
      if (!validStatuses.includes(adminDec)) {
        this.throw422(`قيمة غير صالحة في عمود قرار الإدارة للطالب رقم ${row.studentId}: ${row.adminDecision}`);
      }
    }

    // Pre-fetch all expected applications for this phase
    const expectedApplications = await this.prisma.studentApplication.findMany({
      where: { phaseId },
      include: { student: { select: { id: true } } },
    });

    const dbStudentIdStrings = new Set(
      expectedApplications.map((app) => String(app.student.id))
    );

    // Validate if uploaded students belong to the phase
    for (const id of uniqueStudentIds) {
      if (!dbStudentIdStrings.has(id)) {
        this.throw422(`Student ID ${id} does not belong to this application date period`);
      }
    }

    // ==========================================================
    // PHASE 2: PROCESSING (CHUNKED PROMISES)
    // ==========================================================
    // FIX: Replaced sequential await with mapped Prisma operations

    let updated = 0;
    const updateOperations: any[] = [];

    for (const row of rows) {
      const app = expectedApplications.find(
        (a) => String(a.student.id) === row.studentId
      );

      if (app) {
        updateOperations.push(
          this.prisma.studentApplication.update({
            where: { id: app.id },
            data: {
              securityReviewStatus: this.mapSecurityStatus(row.securityStatus.trim()),
              candidateForFinalAcceptance: this.mapAdminDecision(row.adminDecision.trim()),
              messageToStudent: row.message.trim(),
            },
          })
        );
        updated++;
      }
    }

    // Process transactions in chunks to avoid DB timeouts on large sheets
    const chunkSize = ACCEPTANCE_CONSTANTS.PIPELINE.CHUNK_SIZE || 500;
    for (let i = 0; i < updateOperations.length; i += chunkSize) {
      await this.prisma.$transaction(updateOperations.slice(i, i + chunkSize));
    }

    this.logger.log(`Import result for phase ${phaseId} - Updated: ${updated}`);
    
    return { updated };
  }
}