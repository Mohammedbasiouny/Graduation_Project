import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {Prisma } from '@prisma/client';
import {
  CreateEgyptianPersonalInfoDto,
  CreateNonEgyptianPersonalInfoDto,
  EgyptianResidenceInfoDto,
  NonEgyptianResidenceInfoDto,
  CreateNewStudentAcademicInfoDto,
  CreateOldStudentAcademicInfoDto,
  NonEgyptianPreUniversityInfoDto,
  EgyptianPreUniversityInfoDto,
  CreateHouseTypeDto,
  ParentGuardianDto,
  NonEgyptianRelativeDto,
  ParentsInfoDto
} from './dto/index';
import { ResponseHelper } from '../../../response-helper/response-helper';
import { PersonalInfoService } from './sections/personal-info.service';
import { ResidenceInfoService } from './sections/residence-info.service';
import { PreUniversityService } from './sections/pre-university.service';
import { AcademicInfoService } from './sections/academic-info.service';
import { GuardianInfoService } from './sections/guardian-info.service';
import { ParentsInfoService } from './sections/parents-info.service';
import { StudentProfileService } from './sections/student-profile.service';

@Injectable()
export class RegestrationService {
  constructor(
    private prisma: PrismaService,
    private responseHelper: ResponseHelper,
    private readonly personalInfo: PersonalInfoService,
    private readonly residenceInfo: ResidenceInfoService,
    private readonly preUniversity: PreUniversityService,
    private readonly academicInfo: AcademicInfoService,
    private readonly guardianInfo: GuardianInfoService,
    private readonly parentsInfo: ParentsInfoService,
    private readonly studentProfile: StudentProfileService,
  ) { }

  saveEgyptianPersonal(dto: CreateEgyptianPersonalInfoDto, files, userId: number, lang: string) {
    return this.personalInfo.saveEgyptian(dto, files, userId, lang);
  }

  saveNonEgyptianPersonal(dto: CreateNonEgyptianPersonalInfoDto, files, userId: number, lang: string) {
    return this.personalInfo.saveNonEgyptian(dto, files, userId, lang);
  }

  saveEgyptianResidence(dto: EgyptianResidenceInfoDto, userId: number, lang: string) {
    return this.residenceInfo.saveEgyptian(dto, userId, lang);
  }

  saveNonEgyptianResidence(dto: NonEgyptianResidenceInfoDto, files, userId: number, lang: string) {
    return this.residenceInfo.saveNonEgyptian(dto, files, userId, lang);
  }

  savePreUniInsideEgypt(dto: EgyptianPreUniversityInfoDto, files, userId: number, lang: string) {
    return this.preUniversity.saveInsideEgypt(dto, files, userId, lang);
  }

  savePreUniOutsideEgypt(dto: NonEgyptianPreUniversityInfoDto, files, userId: number, lang: string) {
    return this.preUniversity.saveOutsideEgypt(dto, files, userId, lang);
  }

  saveNewStudentAcademic(dto: CreateNewStudentAcademicInfoDto, files, userId: number, lang: string) {
    return this.academicInfo.saveNewStudent(dto, files, userId, lang);
  }

  saveOldStudentAcademic(dto: CreateOldStudentAcademicInfoDto, files, userId: number, lang: string) {
    return this.academicInfo.saveOldStudent(dto, files, userId, lang);
  }

  saveEgyptianGuardian(dto: ParentGuardianDto, files, userId: number, lang: string) {
    return this.guardianInfo.saveEgyptian(dto, files, userId, lang);
  }

  saveNonEgyptianGuardian(dto: NonEgyptianRelativeDto, files, userId: number, lang: string) {
    return this.guardianInfo.saveNonEgyptian(dto, files, userId, lang);
  }

  saveParentsInfo(dto: ParentsInfoDto, userId: number, lang: string) {
    return this.parentsInfo.save(dto, userId, lang);
  }

  async createHouseTypeInfo(
    dto: CreateHouseTypeDto,
    id: number,
    lang: string,
  ) {

    const periodStatus = await this.prisma.settings.findFirst({
      select: {
        application_period_open: true,
      },
    });

    if (!periodStatus?.application_period_open) {
      throw new BadRequestException('student.REGISTRATION_PERIOD_NOT_ACTIVE');
    }
    const student = await this.prisma.student.findUnique({
      where: { userId: id },
      select: {
        id: true,
        applied_at: true,
      },
    });

    if (!student) throw new NotFoundException('common.USER_NOT_FOUND');

    if (student) {
      const applicationDate = await this.prisma.applicationDate.findFirst({
        where: {
          startAt: {
            lte: student.applied_at,
          },
          endAt: {
            gte: student.applied_at,
          },
        },
      });

      if (!applicationDate) {
        throw new BadRequestException(
          'No valid application period found for this student',
        );
      }

      const now = new Date();

      if (now > applicationDate.endAt) {
        throw new BadRequestException(
          'student.CANNOT_UPDATE_AFTER_PERIOD_END',
        );
      }
    }

    try {
      const updatedStudent = await this.prisma.student.update({
        where: { userId: id },
        data: {
          dormType: dto.housing_type,
          requiresMeals: dto.meals,
        },
      });

      return this.responseHelper.success(
        { id: updatedStudent.id },
        'student.HOUSE_TYPE_INFO_SUCCESS',
        lang,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('student.UPDATE_TARGET_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException('student.HOUSE_TYPE_INFO_ERROR');
    }
  }

  getStudentProfile(userId: number, lang: string) {
    return this.studentProfile.getById(userId, lang);
  }

  deleteStudentProfile(userId: number, lang: string) {
    return this.studentProfile.delete(userId, lang);
  }

}