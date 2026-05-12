import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PeriodGuardHelper } from "../helpers/period.guard.helper";
import { DocumentHelper } from "../helpers/document.helper";
import { EgyptianIdValidator } from "../validators/egyptian-id.validator";
import { I18nService } from "nestjs-i18n";
import { ResponseHelper } from "src/response-helper/response-helper";
import { NonEgyptianRelativeDto, ParentGuardianDto } from "../dto";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";

@Injectable()
export class GuardianInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodGuard: PeriodGuardHelper,
    private readonly docHelper: DocumentHelper,
    private readonly egyptianIdValidator: EgyptianIdValidator,
    private readonly i18n: I18nService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  // ── Egyptian Guardian ─────────────────────────────
  async saveEgyptian(dto: ParentGuardianDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);
    this.assertStudentIsEgyptian(student);

    if (student.isGuardianEgyptian === false) {
      const existingVisa = student.documents.find(d => d.document_type === 'guardian_identity');
      if (existingVisa?.file_path) {
        this.docHelper.deleteFile(existingVisa.file_path);
        await this.deleteDocumentById(existingVisa.id);
      }
    }
    if (files.national_id_front_image?.[0])
      await this.egyptianIdValidator.assertFrontImage(files.national_id_front_image[0], 'national_id_front_image');

    const uploadedFiles: string[] = [];

    try {
      await this.prisma.$transaction(async (tx) => {
        const updated = await tx.student.update({
          where: { userId },
          data: {
            isGuardianEgyptian: true,
            guardianName: dto.full_name,
            guardianNationalId: dto.national_id,
            guardianOccupation: dto.job_title,
            guardianPhoneNumber: dto.mobile_number,
            guardianRelationship: dto.relationship,
            guardianNationality: dto.nationality,
          },
        });

        for (const [fileKey, docType] of [['national_id_front_image', 'guardian_id_front'], ['national_id_back_image', 'guardian_id_back']] as const) {
          await this.docHelper.replaceSingle(tx, updated.id, docType, files[fileKey]?.[0], uploadedFiles);
        }

        // Ensure both sides are present on first save
        await this.assertBothGuardianIds(tx, updated.id);
      });

      return this.responseHelper.success({ id: student.id }, 'student.GUARDIAN_INFO_SUCCESS', lang);
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('student.GUARDIAN_INFO_ERROR');
    }
  }

  // ── Non-Egyptian Guardian ─────────────────────────
  async saveNonEgyptian(dto: NonEgyptianRelativeDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);
    this.assertStudentIsEgyptian(student);

    if (student.isGuardianEgyptian === true) {
      const frontDoc = student.documents.find(d => d.document_type === 'guardian_id_front');
      if (frontDoc?.file_path) {
        this.docHelper.deleteFile(frontDoc.file_path);
        await this.deleteDocumentById(frontDoc.id);
      }

      const backDoc = student.documents.find(d => d.document_type === 'guardian_id_back');
      if (backDoc?.file_path) {
        this.docHelper.deleteFile(backDoc.file_path);
        await this.deleteDocumentById(backDoc.id);
      }
    }

    const uploadedFiles: string[] = [];

    try {
      await this.prisma.$transaction(async (tx) => {
        const updated = await tx.student.update({
          where: { userId },
          data: {
            isGuardianEgyptian: false,
            guardianName: dto.full_name,
            guardianNationality: dto.nationality,
            guardianPhoneNumber: dto.mobile_number,
            guardianNationalId: dto.identity_number,
            guardianOccupation: dto.job_title,
            guardianRelationship: dto.relationship,
          },
        });

        await this.docHelper.replaceSingle(tx, updated.id, 'guardian_identity', files.identity_image?.[0], uploadedFiles);
        await this.docHelper.requireDocumentExists(tx, updated.id, 'guardian_identity', this.i18n.translate('student.GUARDIAN_IDENTITY_REQUIRED'));
      });

      return this.responseHelper.success({ id: student.id }, 'student.GUARDIAN_INFO_SUCCESS', lang);
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('student.GUARDIAN_INFO_ERROR');
    }
  }

  // ── Private helpers ───────────────────────────────
  private async assertBothGuardianIds(tx, studentId: number) {
    const [front, back] = await Promise.all([
      tx.document.findFirst({ where: { student_id: studentId, document_type: 'guardian_id_front' } }),
      tx.document.findFirst({ where: { student_id: studentId, document_type: 'guardian_id_back' } }),
    ]);

    const errors: Record<string, string[]> = {};
    if (!front) errors['id_front_image'] = [this.i18n.translate('student.guardian_id_front_required')];
    if (!back) errors['id_back_image'] = [this.i18n.translate('student.guardian_id_back_required')];
    if (Object.keys(errors).length) ValidationErrorHelper.throw(errors);
  }

  private assertStudentIsEgyptian(student: { isEgyptian: boolean }) {
    if (!student.isEgyptian)
      throw new BadRequestException('student.STUDENT_NOT_EGYPTIAN');
  }

  private async findStudent(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: {
        id: true, isEgyptian: true, isGuardianEgyptian: true,
        documents:true,
        applied_at: true,

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