import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { ExcelHeaderHelper } from '../helpers/excel-header.helper';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ImportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper,
        private readonly headerHelper: ExcelHeaderHelper,
    ) { }

    async importSecurityReview(file: Express.Multer.File, lang: string) {
        if (!file) throw new BadRequestException('FILE_REQUIRED');

        const sheet = await this.loadSheet(file);
        const headerRow = sheet.getRow(1);
        const headerMap = this.headerHelper.buildHeaderMap(headerRow);

        const studentIdCol = this.headerHelper.findColumnIndex(headerMap, [
            'studentIdCode', 'student_id_code', 'student id code', 'كود الطالب',
        ]);

        const acceptCol = this.headerHelper.findColumnIndex(headerMap, [
            'accept (0 or 1)', 'accept', 'accept 0 or 1', 'accept(0 or 1)',
            'قبول (0 أو 1)', 'قبول (0 او 1)', 'قبول',
            'القبول (0 أو 1)', 'القبول (0 او 1)', 'القبول',
        ]);

        if (!studentIdCol || !acceptCol) {
            const detected = Object.keys(headerMap).filter(k => !/^\d+$/.test(k));
            throw new BadRequestException(
                `الأعمدة المطلوبة غير موجودة. الأعمدة المكتشفة: ${JSON.stringify(detected, null, 2)}\n\nالمطلوب: "كود الطالب" و "قبول (0 أو 1)"`,
            );
        }

        const updates = await this.processRows(sheet, studentIdCol, acceptCol);

        return this.responseHelper.success(
            { updatedStudentIds: updates },
            'student.SECURITY_REVIEW_IMPORT_RESULT',
            lang,
        );
    }

    // ── Private helpers ───────────────────────────────
    private async loadSheet(file: Express.Multer.File): Promise<ExcelJS.Worksheet> {
        const workbook = new ExcelJS.Workbook();

        try {
            await workbook.xlsx.load(file.buffer as unknown as any);
        } catch {
            throw new BadRequestException('INVALID_EXCEL_FILE: Unable to read the file. Ensure it is a valid .xlsx file');
        }

        if (!workbook.worksheets.length) throw new BadRequestException('NO_SHEETS_FOUND_IN_EXCEL');

        return workbook.getWorksheet('Students') ?? workbook.worksheets[0];
    }

    private async processRows(
        sheet: ExcelJS.Worksheet,
        studentIdCol: number,
        acceptCol: number,
    ): Promise<string[]> {
        const updates: string[] = [];

        for (let i = 2; i <= sheet.rowCount; i++) {
            const row = sheet.getRow(i);

            const studentId = this.cellValueToString(row.getCell(studentIdCol).value).trim();
            if (!studentId) continue;

            const accept = this.parseAcceptValue(row.getCell(acceptCol).value);

            await this.prisma.studentApplication.updateMany({
                where: { id: Number(studentId) },
                data: { securityReviewStatus: accept === 1 },
            });

            updates.push(studentId);
        }

        return updates;
    }

    private cellValueToString(raw: unknown): string {
        if (raw == null) return '';

        if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
            return String(raw);
        }

        if (raw instanceof Date) {
            return raw.toISOString();
        }

        if (typeof raw === 'object') {
            const value = raw as { text?: unknown; result?: unknown; richText?: Array<{ text?: string }> };

            if (typeof value.text === 'string') return value.text;
            if (typeof value.result === 'string' || typeof value.result === 'number' || typeof value.result === 'boolean') {
                return String(value.result);
            }
            if (Array.isArray(value.richText)) {
                return value.richText.map(part => part.text ?? '').join('');
            }
        }

        return '';
    }

    private parseAcceptValue(raw: any): number | null {
        if (raw == null) return null;

        let value = typeof raw === 'string' ? raw.trim() : raw;

        if (value === '1' || value === 'نعم' || value === 'مقبول') return 1;
        if (value === '0' || value === 'لا' || value === 'مرفوض') return 0;

        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    }
}