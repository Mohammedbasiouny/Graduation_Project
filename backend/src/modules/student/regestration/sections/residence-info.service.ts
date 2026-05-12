import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PeriodGuardHelper } from "../helpers/period.guard.helper";
import { DocumentHelper } from "../helpers/document.helper";
import { I18nService } from "nestjs-i18n";
import { ResponseHelper } from "src/response-helper/response-helper";
import { EgyptianResidenceInfoDto, NonEgyptianResidenceInfoDto } from "../dto";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";
import { AddressValidator } from "../validators/address.validator";

@Injectable()
export class ResidenceInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodGuard: PeriodGuardHelper,
    private readonly docHelper: DocumentHelper,
    private readonly addressValidator: AddressValidator,
    private readonly i18n: I18nService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  // ── Egyptian ──────────────────────────────────────
  async saveEgyptian(dto: EgyptianResidenceInfoDto, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (student.is_inside_egypt === false){
      const existingVisa = student.documents.find(d => d.document_type === 'visa_or_residency_image');
      if (existingVisa?.file_path) {
        this.docHelper.deleteFile(existingVisa.file_path);
        await this.deleteDocumentById(existingVisa.id);
      }
    }

    await this.addressValidator.assertValidAddress(dto.governorate, dto.district_or_center, dto.city_or_village);

    const updated = await this.prisma.student.update({
      where: { userId },
      data: {
        is_inside_egypt: true,
        countryOfResidence: dto.country,
        governorateId: dto.governorate,
        policeDepartmentId: dto.district_or_center,
        cityId: dto.city_or_village,
        fullAddress: dto.detailed_address,
        residencyInfoCompleted: true,
      },
    });

    return this.responseHelper.success({ id: updated.id }, 'student.RESIDENCE_INFO_SUCCESS', lang);
  }

  // ── Non-Egyptian ──────────────────────────────────
  async saveNonEgyptian(dto: NonEgyptianResidenceInfoDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    const uploadedFiles: string[] = [];

    try {
      await this.prisma.$transaction(async (tx) => {
        const existingVisa = await tx.document.findFirst({
          where: { student_id: student.id, document_type: 'visa_or_residency_image' },
        });

        if (!files.visa_or_residency_image?.[0] && !existingVisa)
          ValidationErrorHelper.field('visa_or_residency_image', this.i18n.translate('student.VISA_FILE_REQUIRED'));

        const updated = await tx.student.update({
          where: { userId },
          data: {
            is_inside_egypt: false,
            countryOfResidence: dto.country,
            fullAddress: dto.detailed_address,
            residencyInfoCompleted: true,
            governorateId: null,
            policeDepartmentId: null,
            cityId: null,
          },
        });

        await this.docHelper.replaceSingle(tx, updated.id, 'visa_or_residency_image', files.visa_or_residency_image?.[0], uploadedFiles);
      });

      return this.responseHelper.success({ id: student.id }, 'student.NON_EGYPT_RESIDENCE_SUCCESS', lang);
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      throw err instanceof HttpException ? err : new InternalServerErrorException('student.RESIDENCE_INFO_ERROR');
    }
  }

  private async findStudent(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: { id: true, is_inside_egypt: true, applied_at: true, documents: true },
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