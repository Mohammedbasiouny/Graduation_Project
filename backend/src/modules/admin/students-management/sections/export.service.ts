import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ExportStudentsDto } from '../dto/export-students.dto';
import { ExcelHeaderHelper } from '../helpers/excel-header.helper';
import { StudentCompletionHelper } from '../helpers/student-completion.helper';
import { RELATION_MAP } from '../constants/relation-map.constant';
import { EXPORT_HEADER_AR } from '../constants/export-headers.constant';
import { EXPORT_ALLOWED_FIELDS } from '../constants/export-fields.constant';

const archiver = require('archiver');

type ExportStudentDoc = { document_type: string; file_path: string | null };
type ExportStudent = { id: number; studentIdCode?: string | null; nationalId?: string | null; passportNumber?: string | null; documents?: ExportStudentDoc[];[key: string]: any };
type ArchiveEntry = { absPath: string; zipPath: string };

const GENDER_AR_MAP: Record<string, string> = {
    male: 'ذكر',
    female: 'انثي',
};

@Injectable()
export class ExportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly headerHelper: ExcelHeaderHelper,
        private readonly completionHelper: StudentCompletionHelper,
    ) { }

    async exportZip(dto: ExportStudentsDto, res: Response): Promise<void> {
        try {
            const { fields, applicationPeriodId, filters } = dto;

            this.validateFields(fields);

            const documentFields = this.getDocumentFields(fields);
            const where = await this.buildWhere(applicationPeriodId, filters);
            const include = this.buildInclude(fields, documentFields);

            const students = (await this.prisma.student.findMany({ where, include })) as ExportStudent[];
            const completedStudents = students.filter(s => this.completionHelper.isCompleted(s));

            if (!completedStudents.length) throw new NotFoundException('common.NO_DATA_FOUND_FOR_EXPORT');

            const { studentDocExportMap, studentDocArchiveMap } = this.buildDocumentMaps(completedStudents, documentFields);

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Students', {
                views: [{ rightToLeft: true }],   
            });

            const finalColumns = [
                { header: 'كود الطالب', key: 'studentIdCode', width: 20 },
                ...fields.map(f => ({ header: EXPORT_HEADER_AR[f] ?? f, key: f, width: 30 })),
            ];

            sheet.columns = finalColumns;

            // ── Header row styling ──────────────────────────────────────
            const headerRow = sheet.getRow(1);
            headerRow.height = 32;
            headerRow.eachCell(cell => {
                cell.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F3864' } }; // dark navy
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false };
                cell.border = {
                    bottom: { style: 'medium', color: { argb: 'FFFFFFFF' } },
                };
            });

            // Freeze header row
            sheet.views = [{ state: 'frozen', ySplit: 1, rightToLeft: true }];

            // ── Data rows ───────────────────────────────────────────────
            completedStudents.forEach((student, rowIndex) => {
                const row = this.buildRow(student, fields, documentFields, studentDocExportMap);
                const addedRow = sheet.addRow(row);
                addedRow.height = 22;

                // Alternating row background
                const bgColor = rowIndex % 2 === 0 ? 'FFFAFAFA' : 'FFE8EEF7';

                addedRow.eachCell({ includeEmpty: true }, cell => {
                    cell.font = { name: 'Arial', size: 11 };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                        right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    };
                });

                // Lock first cell (student code), unlock the rest
                addedRow.getCell(1).protection = { locked: true };
                for (let col = 2; col <= finalColumns.length; col++) {
                    addedRow.getCell(col).protection = { locked: false };
                }

                // Hyperlink styling for document fields
                fields.forEach((field, index) => {
                    if (!documentFields.includes(field)) return;
                    const cell = addedRow.getCell(index + 2);
                    if (cell.value && typeof cell.value === 'object') {
                        cell.font = {
                            name: 'Arial', size: 11,
                            color: { argb: 'FF1155CC' },
                            underline: true,
                            bold: false,
                        };
                    }
                });
            });

            // ── Auto-fit column widths based on content ─────────────────
            sheet.columns.forEach(column => {
                if (!column) return;
                let maxLen = (column.header as string)?.length ?? 10;
                column.eachCell?.({ includeEmpty: false }, cell => {
                    const val = cell.value;
                    let len = 10;
                    if (typeof val === 'string') len = val.length;
                    else if (val && typeof val === 'object' && 'text' in val) len = (val as any).text?.length ?? 10;
                    if (len > maxLen) maxLen = len;
                });
                column.width = Math.min(Math.max(maxLen + 4, 14), 50);
            });

            // ── Page setup & margins ────────────────────────────────────
            sheet.pageSetup = {
                paperSize: 9,                // A4
                orientation: 'landscape',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0,
                horizontalCentered: true,
                verticalCentered: false,
                margins: {
                    left: 0.5, right: 0.5,
                    top: 0.75, bottom: 0.75,
                    header: 0.3, footer: 0.3,
                } as any,
            };

            // ── Sheet protection ────────────────────────────────────────
            await sheet.protect('password123', {
                selectLockedCells: true,
                selectUnlockedCells: true,
                formatCells: false,
            });

            const excelBuffer = await workbook.xlsx.writeBuffer();

            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=students_export.zip',
            });

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);
            archive.append(Buffer.from(excelBuffer), { name: 'students.xlsx' });
            this.appendFilesToArchive(archive, completedStudents, studentDocArchiveMap);
            await archive.finalize();

        } catch (err: any) {
            if (err instanceof Error && 'getStatus' in err) throw err;
            throw new InternalServerErrorException(err?.message ?? 'Export failed');
        }
    }

    // ── Validation ────────────────────────────────────
    private validateFields(fields: string[]): void {
        if (!Array.isArray(fields) || !fields.length) {
            throw new BadRequestException('fields must be a non-empty array');
        }
        const invalid = fields.filter(f => !EXPORT_ALLOWED_FIELDS.has(f));
        if (invalid.length) {
            throw new BadRequestException(`Invalid fields: ${invalid.join(', ')}`);
        }
    }

    private getDocumentFields(fields: string[]): string[] {
        const patterns = ['_image', '_front', '_back', '_certificate', '_proof'];
        return fields.filter(f => patterns.some(p => f.includes(p)));
    }

    // ── Query builders ────────────────────────────────
    private async buildWhere(periodId: number | undefined, filters: ExportStudentsDto['filters']) {
        const where: Record<string, any> = {};

        if (periodId) {
            const period = await this.prisma.applicationDate.findUnique({ where: { id: periodId } });
            if (!period) throw new NotFoundException('Application period not found');
            where.applied_at = { gte: period.startAt, lte: period.endAt };
        }

        if (filters) {
            if (filters.gender) where.gender = filters.gender;
            if (filters.religion) where.religion = filters.religion;
            if (filters.isEgyptian !== undefined) where.isEgyptian = filters.isEgyptian;
            if (filters.is_new !== undefined) where.is_new = filters.is_new;
        }

        return where;
    }

    private buildInclude(fields: string[], documentFields: string[]): Record<string, any> {
        const include: Record<string, any> = {
            medicalReviews: { select: { id: true } }
        };

        if (documentFields.length) {
            include.documents = {
                where: {
                    OR: documentFields.flatMap(f => [
                        { document_type: f },
                        { document_type: { startsWith: `${f}_` } },
                    ]),
                },
                select: { document_type: true, file_path: true },
            };
        }

        for (const field of fields) {
            const rel = RELATION_MAP[field];
            if (rel) include[rel.relation] = { select: { [rel.field]: true } };
        }

        return include;
    }

    // ── Document maps ─────────────────────────────────
    private buildDocumentMaps(students: ExportStudent[], documentFields: string[]) {
        const studentDocExportMap = new Map<number, Map<string, string[]>>();
        const studentDocArchiveMap = new Map<number, ArchiveEntry[]>();

        for (const student of students) {
            const { exportMap, archiveEntries } = this.buildStudentDocuments(student, documentFields);
            studentDocExportMap.set(student.id, exportMap);
            studentDocArchiveMap.set(student.id, archiveEntries);
        }

        return { studentDocExportMap, studentDocArchiveMap };
    }

    private buildStudentDocuments(student: ExportStudent, documentFields: string[]) {
        const identifier = student.nationalId || student.passportNumber;
        if (!identifier) return { exportMap: new Map<string, string[]>(), archiveEntries: [] };

        const exportMap = new Map<string, string[]>();
        const archiveEntries: ArchiveEntry[] = [];
        const usedZipPaths = new Set<string>();

        for (const doc of student.documents ?? []) {
            const entry = this.buildDocumentEntry(identifier, doc, documentFields, usedZipPaths);
            if (!entry) continue;

            const existing = exportMap.get(entry.baseType) ?? [];
            existing.push(entry.zipRelativePath);
            exportMap.set(entry.baseType, existing);
            archiveEntries.push({ absPath: entry.absPath, zipPath: entry.zipRelativePath });
        }

        return { exportMap, archiveEntries };
    }

    private buildDocumentEntry(
        identifier: string,
        doc: ExportStudentDoc,
        documentFields: string[],
        usedZipPaths: Set<string>,
    ) {
        if (!doc.file_path) return null;

        const baseType = doc.document_type.replace(/_\d+$/, '');
        if (!documentFields.includes(baseType)) return null;

        const absPath = path.join(process.cwd(), doc.file_path);
        if (!fs.existsSync(absPath)) return null;

        const ext = path.extname(doc.file_path);
        const orderMatch = /_(\d+)$/.exec(doc.document_type);
        const order = orderMatch ? Number(orderMatch[1]) : 1;
        const suffix = order === 1 ? '' : `_${order}`;

        let zipPath = `students/${identifier}/${baseType}${suffix}${ext}`;
        if (usedZipPaths.has(zipPath)) {
            let i = order + 1;
            while (usedZipPaths.has(`students/${identifier}/${baseType}_${i}${ext}`)) i++;
            zipPath = `students/${identifier}/${baseType}_${i}${ext}`;
        }

        usedZipPaths.add(zipPath);
        return { baseType, absPath, zipRelativePath: zipPath };
    }

    // ── Row builder ───────────────────────────────────
    private buildRow(
        student: ExportStudent,
        fields: string[],
        documentFields: string[],
        studentDocExportMap: Map<number, Map<string, string[]>>,
    ): Record<string, any> {
        const identifier = student.nationalId || student.passportNumber;
        const row: Record<string, any> = { studentIdCode: student.id };

        for (const field of fields) {
            const rel = RELATION_MAP[field];
            if (rel) {
                row[field] = student[rel.relation]?.[rel.field] ?? '';
                continue;
            }

            if (documentFields.includes(field)) {
                const docPaths = studentDocExportMap.get(student.id)?.get(field) ?? [];
                if (docPaths.length === 1) row[field] = { text: 'عرض الصورة', hyperlink: docPaths[0] };
                else if (docPaths.length > 1) row[field] = { text: `عرض ${docPaths.length} ملفات`, hyperlink: `students/${identifier}/` };
                else row[field] = '';
                continue;
            }

            if (field === 'gender') {
                const genderValue = String(student[field] ?? '').toLowerCase();
                row[field] = GENDER_AR_MAP[genderValue] ?? student[field] ?? '';
                continue;
            }

            row[field] = student[field] ?? '';
        }

        return row;
    }

    // ── Archive ───────────────────────────────────────
    private appendFilesToArchive(
        archive: any,
        students: ExportStudent[],
        studentDocArchiveMap: Map<number, ArchiveEntry[]>,
    ): void {
        for (const student of students) {
            const entries = studentDocArchiveMap.get(student.id) ?? [];
            for (const entry of entries) {
                if (!fs.existsSync(entry.absPath)) continue;
                archive.file(entry.absPath, { name: entry.zipPath });
            }
        }
    }
}