import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PeriodGuardHelper } from "../helpers/period.guard.helper";
import { I18nService } from "nestjs-i18n";
import { ResponseHelper } from "src/response-helper/response-helper";
import { EgyptianPreUniversityInfoDto, NonEgyptianPreUniversityInfoDto } from "../dto";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";
import { DocumentHelper } from "../helpers/document.helper";
@Injectable()
export class PreUniversityService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly periodGuard: PeriodGuardHelper,
        private readonly docHelper: DocumentHelper,
        private readonly i18n: I18nService,
        private readonly responseHelper: ResponseHelper,
    ) { }

    // ── Inside Egypt ──────────────────────────────────
    async saveInsideEgypt(dto: EgyptianPreUniversityInfoDto, files, userId: number, lang: string) {
        const student = await this.findStudent(userId);
        await this.periodGuard.guardStudent(student);

        await this.assertValidCertificate(dto.certificate_type);
        this.assertValidPercentage(dto.percentage);

        const existingEnrollmentProof = student.documents.find(d => d.document_type === 'enrollment_proof_image');
        const existingNominationCard = student.documents.find(d => d.document_type === 'nomination_card_image');
        if (existingEnrollmentProof?.file_path) {
            this.docHelper.deleteFile(existingEnrollmentProof.file_path);
            await this.deleteDocumentById(existingEnrollmentProof.id);
        }
        if (existingNominationCard?.file_path) {
            this.docHelper.deleteFile(existingNominationCard.file_path);
            await this.deleteDocumentById(existingNominationCard.id);
        }

        return this.persist(
            userId,
            student,
            {
                is_new: true,
                highSchoolFromEgypt: true,
                highSchoolTotalGrade: dto.total_score,
                highSchoolCountry: dto.certificate_country,
                highSchoolGovernorate: dto.governorate,
                highSchoolEducationDistrictId: dto.educational_administration,
                qualificationId: dto.certificate_type,
                percentage: dto.percentage,

                academicInfoCompleted: false,
                facultyId: null,
                departmentId: null,
                admissionYear: null,
                academicYear: null,
                studentIdCode: null,
                educationSystemType: null,
                grade: null,
                totalAcademicGrade: null,
                enrollmentStatus: null,
            },
            files,
            lang,
        );
    }

    // ── Outside Egypt ─────────────────────────────────
    async saveOutsideEgypt(dto: NonEgyptianPreUniversityInfoDto, files, userId: number, lang: string) {
        const student = await this.findStudent(userId);
        await this.periodGuard.guardStudent(student);

        await this.assertValidCertificate(dto.certificate_type);
        this.assertValidPercentage(dto.percentage);

        const existingEnrollmentProof = student.documents.find(d => d.document_type === 'enrollment_proof_image');
        const existingNominationCard = student.documents.find(d => d.document_type === 'nomination_card_image');
        if (existingEnrollmentProof?.file_path) {
            this.docHelper.deleteFile(existingEnrollmentProof.file_path);
            await this.deleteDocumentById(existingEnrollmentProof.id);
        }
        if (existingNominationCard?.file_path) {
            this.docHelper.deleteFile(existingNominationCard.file_path);
            await this.deleteDocumentById(existingNominationCard.id);
        }

        return this.persist(
            userId,
            student,
            {
                is_new: true,
                highSchoolFromEgypt: false,
                highSchoolTotalGrade: dto.total_score,
                highSchoolCountry: dto.certificate_country,
                qualificationId: dto.certificate_type,
                percentage: dto.percentage,
                highSchoolGovernorate: null,
                highSchoolEducationDistrictId: null,

                academicInfoCompleted: false,
                facultyId: null,
                departmentId: null,
                admissionYear: null,
                academicYear: null,
                studentIdCode: null,
                educationSystemType: null,
                grade: null,
                totalAcademicGrade: null,
                enrollmentStatus: null,
            },
            files,
            lang,
        );
    }

    // ── Shared persist ────────────────────────────────
    // Both inside/outside Egypt follow identical file logic — only DB data differs
    private async persist(userId: number, student, data: object, files, lang: string) {
        const uploadedFiles: string[] = [];

        try {
            await this.prisma.$transaction(async (tx) => {
                const updated = await tx.student.update({ where: { userId }, data });

                await this.saveCertificateFiles(tx, updated.id, files.pre_university_certificate, uploadedFiles);
            });

            return this.responseHelper.success({ id: student.id }, 'student.PRE_UNI_INFO_SUCCESS', lang);
        } catch (err) {
            this.docHelper.rollback(uploadedFiles);
            if (err instanceof HttpException) throw err;
            throw new InternalServerErrorException('student.PRE_UNI_INFO_ERROR');
        }
    }

    private async saveCertificateFiles(tx, studentId: number, certFiles: Express.Multer.File[], uploadedFiles: string[]) {
        if (certFiles?.length) {
            // Delete old certs
            const oldDocs = await tx.document.findMany({
                where: { student_id: studentId, document_type: { startsWith: 'pre_university_certificate' } },
            });
            for (const doc of oldDocs) {
                try { this.docHelper.deleteFile(doc.file_path); } catch { }
            }
            await tx.document.deleteMany({
                where: { student_id: studentId, document_type: { startsWith: 'pre_university_certificate' } },
            });

            // Save new certs
            for (let i = 0; i < certFiles.length; i++) {
                const type = i === 0 ? 'pre_university_certificate' : `pre_university_certificate_${i + 1}`;
                const saved = this.docHelper.saveFile(certFiles[i], studentId, type);
                uploadedFiles.push(saved.absolutePath);
                await tx.document.create({ data: { student_id: studentId, document_type: type, file_path: saved.relativePath } });
            }
        } else {
            // Ensure at least one old cert exists
            const existing = await tx.document.findFirst({
                where: { student_id: studentId, document_type: { startsWith: 'pre_university_certificate' } },
            });
            if (!existing)
                ValidationErrorHelper.field('pre_university_certificate', this.i18n.translate('student.CERTIFICATE_FILE_REQUIRED'));
        }
    }

    private async assertValidCertificate(id: number) {
        const cert = await this.prisma.preUniversityQualification.findUnique({ where: { id }, select: { id: true } });
        if (!cert) ValidationErrorHelper.field('certificate_type', this.i18n.translate('student.INVALID_CERTIFICATE_TYPE_OR_DEGREE'));
    }

    private assertValidPercentage(percentage: number) {
        if (percentage < 0 || percentage > 100)
            ValidationErrorHelper.field('percentage', this.i18n.translate('student.INVALID_PERCENTAGE'));
    }

    private async findStudent(userId: number) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            select: {
                id: true, highSchoolFromEgypt: true, is_new: true, applied_at: true,
                documents: true
            },
        });
        if (!student) throw new NotFoundException('common.USER_NOT_FOUND');
        return student;
    }
    private async deleteDocumentById(documentId: number): Promise<void> {
        await this.prisma.document.delete({
            where: { id: documentId },
        });
    }
}