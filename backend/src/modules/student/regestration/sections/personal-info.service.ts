import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PeriodGuardHelper } from "../helpers/period.guard.helper";
import { DocumentHelper } from "../helpers/document.helper";
import { EgyptianIdValidator } from "../validators/egyptian-id.validator";
import { I18nService } from "nestjs-i18n";
import { ResponseHelper } from "src/response-helper/response-helper";
import { CreateEgyptianPersonalInfoDto, CreateNonEgyptianPersonalInfoDto } from "../dto";
import { Gender } from "@prisma/client";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";

@Injectable()
export class PersonalInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodGuard: PeriodGuardHelper,
    private readonly docHelper: DocumentHelper,
    private readonly egyptianIdValidator: EgyptianIdValidator,
    private readonly i18n: I18nService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // ── Egyptian ──────────────────────────────────────
  async saveEgyptian(dto: CreateEgyptianPersonalInfoDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (student && !student.isEgyptian)
      throw new BadRequestException('student.STUDENT_IS_NOT_EGYPTIAN');

    await this.assertNationalIdUnique(dto.national_id, userId);
    await this.assertMobileUnique(dto.mobile_number, userId);

    if (files.national_id_front_image?.[0])
      await this.egyptianIdValidator.assertFrontImage(files.national_id_front_image[0], 'national_id_front_image');

    const { gender, birthDate } = this.parseNationalId(dto.national_id);
    const uploadedFiles: string[] = [];

    try {
      let result: { id: number };
      const isUpdate = !!student;
      await this.prisma.$transaction(async (tx) => {
        if (isUpdate) {
          const appliedAt = student.applied_at ?? new Date();
          result = await tx.student.update({
            where: { id: student.id },
            data: this.egyptianStudentData(dto, gender, birthDate, appliedAt),
          });
        } else {
          this.assertRequiredFiles(files, ['personal_image', 'national_id_front_image', 'national_id_back_image']);
          result = await tx.student.create({
            data: { userId, isEgyptian: true, ...this.egyptianStudentData(dto, gender, birthDate) },
          });
        }

        await this.savePersonalImages(tx, result.id, files, uploadedFiles);
      });

      return this.responseHelper.success(
        { id: result.id },
        isUpdate ? 'student.PERSONAL_INFO_UPDATED' : 'student.PERSONAL_INFO_SUCCESS',
        lang,
      );
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      throw err instanceof HttpException ? err : new InternalServerErrorException('student.PERSONAL_INFO_ERROR');
    }
  }

  // ── Non-Egyptian ──────────────────────────────────
  async saveNonEgyptian(dto: CreateNonEgyptianPersonalInfoDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (student?.isEgyptian)
      throw new BadRequestException('student.STUDENT_IS_EGYPTIAN');

    await this.assertMobileUnique(dto.mobile_number, userId);

    const uploadedFiles: string[] = [];

    try {
      let studentId: number;
      const isUpdate = !!student;
      await this.prisma.$transaction(async (tx) => {
        if (isUpdate) {
          const appliedAt = student.applied_at ?? new Date();
          const updated = await tx.student.update({
            where: { id: student.id },
            data: this.nonEgyptianStudentData(dto, appliedAt),
          });
          studentId = updated.id;
        } else {
          this.assertRequiredFiles(files, ['personal_image', 'passport_image']);
          const created = await tx.student.create({
            data: { userId, isEgyptian: false, ...this.nonEgyptianStudentData(dto) },
          });
          studentId = created.id;
        }

        for (const type of ['personal_image', 'passport_image']) {
          await this.docHelper.replaceSingle(tx, studentId, type, files[type]?.[0], uploadedFiles);
        }
      });

      return this.responseHelper.success(
        { id: studentId },
        isUpdate ? 'student.PERSONAL_INFO_UPDATED' : 'student.PERSONAL_INFO_SUCCESS',
        lang,
      );
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      throw err instanceof HttpException ? err : new InternalServerErrorException('student.PERSONAL_INFO_ERROR');
    }
  }

  // ── Private helpers ───────────────────────────────
  private async findStudent(userId: number) {
    return this.prisma.student.findUnique({
      where: { userId },
      select: { id: true, isEgyptian: true, applied_at: true },
    });
  }

  private parseNationalId(id: string) {
    const century = id.startsWith('3') ? '20' : '19';
    const year = Number.parseInt(century + id.substring(1, 3));
    const month = Number.parseInt(id.substring(3, 5));
    const day = Number.parseInt(id.substring(5, 7));
    const birthDate = new Date(`${year}-${month}-${day}`);
    birthDate.setDate(birthDate.getDate() + 1);
    const gender = Number.parseInt(id[12]) % 2 === 0 ? 'female' : 'male';
    return { gender, birthDate };
  }

  private egyptianStudentData(dto, gender, birthDate, appliedAt?) {
    return {
      nationalId: dto.national_id,
      fullName: dto.full_name,
      religion: dto.religion,
      placeOfBirth: dto.birth_country,
      phoneNumber: dto.mobile_number,
      telephone: dto.landline_number,
      birthCity: dto.birth_city,
      nationality: dto.nationality,
      personalInfoCompleted: true,
      gender,
      dateOfBirth: birthDate,
      ...(appliedAt !== undefined && { applied_at: appliedAt }),
    };
  }

  private nonEgyptianStudentData(dto, appliedAt?) {
    const birthDate = new Date(dto.date_of_birth);
    birthDate.setDate(birthDate.getDate() + 1);
    return {
      fullName: dto.full_name,
      religion: dto.religion,
      gender: dto.gender?.toLowerCase() as Gender,
      passportIssuingCountry: dto.passport_issuing_country,
      nationality: dto.nationality,
      passportNumber: dto.passport_number,
      phoneNumber: dto.mobile_number,
      dateOfBirth: birthDate,
      placeOfBirth: dto.place_of_birth,
      personalInfoCompleted: true,
      ...(appliedAt !== undefined && { applied_at: appliedAt }),
    };
  }

  private assertRequiredFiles(files: Record<string, any>, required: string[]) {
    const errors: Record<string, string[]> = {};
    for (const key of required) {
      if (!files[key]?.[0]) errors[key] = [this.i18n.translate(`student.${key.toUpperCase()}_REQUIRED`)];
    }
    if (Object.keys(errors).length) ValidationErrorHelper.throw(errors);
  }

  private async assertNationalIdUnique(nationalId: string, userId: number) {
    const owner = await this.prisma.student.findUnique({
      where: { nationalId },
      select: { userId: true , applied_at: true},
    });
    if (owner && owner.userId !== userId)
      ValidationErrorHelper.field('national_id', this.i18n.translate('student.NATIONAL_ID_ALREADY_EXISTS'));
  }

  private async assertMobileUnique(mobile: string, userId: number) {
    const owner = await this.prisma.student.findFirst({
      where: { phoneNumber: mobile },
      select: { userId: true },
    });
    if (owner && owner.userId !== userId)
      ValidationErrorHelper.field('mobile_number', this.i18n.translate('student.MOBILE_NUMBER_ALREADY_EXISTS'));
  }

  private async savePersonalImages(tx, studentId: number, files, uploadedFiles: string[]) {
    const imageTypes = [
      { file: files.personal_image?.[0],         type: 'personal_image' },
      { file: files.national_id_front_image?.[0], type: 'national_id_front' },
      { file: files.national_id_back_image?.[0],  type: 'national_id_back' },
    ];
    for (const { file, type } of imageTypes) {
      await this.docHelper.replaceSingle(tx, studentId, type, file, uploadedFiles);
    }
  }
}