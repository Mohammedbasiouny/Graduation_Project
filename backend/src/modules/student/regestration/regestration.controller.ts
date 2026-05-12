import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { RegestrationService } from './regestration.service';
import { GetUser } from 'src/modules/auth/decorator';
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
  ParentsInfoDto,
} from './dto/index';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { I18nLang } from 'nestjs-i18n';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';
import { multerConfig } from 'src/common/file-service/multer.config';


@Roles('student')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/register')
export class RegestrationController {
  constructor(private readonly regestrationService: RegestrationService) { }


  @Post('egyptian/personal-info')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'personal_image', maxCount: 1 },
        { name: 'national_id_front_image', maxCount: 1 },
        { name: 'national_id_back_image', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async createPersonalInfoEgyption(
    @GetUser('sub') id: number,
    @Body() dto: CreateEgyptianPersonalInfoDto,
    @UploadedFiles()
    files: {
      personal_image?: Express.Multer.File[];
      national_id_front_image?: Express.Multer.File[];
      national_id_back_image?: Express.Multer.File[];
    },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveEgyptianPersonal(dto, files, id, lang);
  }


  @Post('non-egyptian/personal-info')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'personal_image', maxCount: 1 },
        { name: 'passport_image', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async createPersonalInfoNonEgyption(
    @GetUser('sub') id: number,
    @Body() dto: CreateNonEgyptianPersonalInfoDto,
    @UploadedFiles()
    files: {
      personal_image?: Express.Multer.File[];
      passport_image?: Express.Multer.File[];
    },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveNonEgyptianPersonal(
      dto,
      files,
      id,
      lang,
    );
  }


  @Post('egyptian/residence-info')
  async EgyptionresidenceInfo(
    @Body() dto: EgyptianResidenceInfoDto,
    @GetUser('sub') id: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveEgyptianResidence(dto, id, lang);
  }


  @Post('non-egyptian/residence-info')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'visa_or_residency_image', maxCount: 1 }],
      multerConfig,
    ),
  )
  async ResidenceInfoNonEgyption(
    @Body() dto: NonEgyptianResidenceInfoDto,
    @UploadedFiles()
    files: {
      visa_or_residency_image?: Express.Multer.File[];
    },
    @GetUser('sub') id: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveNonEgyptianResidence(dto, files, id, lang);
  }


  @Post('new-student/academic-info')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'nomination_card_image', maxCount: 1 }],
      multerConfig,
    ),
  )
  async AcademicInfoNewStudent(
    @Body() dto: CreateNewStudentAcademicInfoDto,
    @UploadedFiles()
    files: {
      nomination_card_image?: Express.Multer.File[];
    },
    @GetUser('sub') id: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveNewStudentAcademic(dto, files, id, lang);
  }


  @Post('old-student/academic-info')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'enrollment_proof_image', maxCount: 1 }],
      multerConfig,
    ),
  )
  async AcademicInfoOldStudent(
    @Body() dto: CreateOldStudentAcademicInfoDto,
    @UploadedFiles()
    files: { enrollment_proof_image?: Express.Multer.File[] },
    @GetUser('sub') id: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveOldStudentAcademic(dto, files, id, lang);
  }

  @Post('pre-university-info/inside-egypt')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'pre_university_certificate', maxCount: 10 }],
      multerConfig),
  )
  async createPreUniInfoInsideEgypt(
    @GetUser('sub') id: number,
    @Body() dto: EgyptianPreUniversityInfoDto,
    @UploadedFiles()
    files: { pre_university_certificate?: Express.Multer.File[] },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.savePreUniInsideEgypt(dto, files, id, lang);
  }


  @Post('pre-university-info/outside-egypt')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'pre_university_certificate', maxCount: 10 }],
      multerConfig),
  )
  async createPreUniInfoOutsideEgypt(
    @GetUser('sub') id: number,
    @Body() dto: NonEgyptianPreUniversityInfoDto,
    @UploadedFiles()
    files: { pre_university_certificate?: Express.Multer.File[] },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.savePreUniOutsideEgypt(dto, files, id, lang);
  }

  @Post('student/house-info')
  async createHouseTypeInfo(
    @GetUser('sub') id: number,
    @Body() dto: CreateHouseTypeDto,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.createHouseTypeInfo(dto, id, lang);
  }

  @Post('egyptian/relatives/guardian')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'national_id_front_image', maxCount: 1 },
        { name: 'national_id_back_image', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async saveGuardian(
    @GetUser('sub') userId: number,
    @Body() dto: ParentGuardianDto,
    @UploadedFiles()
    files: {
      national_id_front_image?: Express.Multer.File[];
      national_id_back_image?: Express.Multer.File[];
    },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveEgyptianGuardian(dto, files, userId, lang);
  }


  @Post('non-egyptian/relatives/guardian')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'identity_image', maxCount: 1 }],
      multerConfig,
    ),
  )
  async saveNonEgyptianGuardian(
    @GetUser('sub') userId: number,
    @Body() dto: NonEgyptianRelativeDto,
    @UploadedFiles()
    files: {
      identity_image?: Express.Multer.File[];
    },
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveNonEgyptianGuardian(
      dto,
      files,
      userId,
      lang,
    );
  }

  @Post('parents-info')
  async saveParentsInfo(
    @GetUser('sub') userId: number,
    @Body() dto: ParentsInfoDto,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.saveParentsInfo(
      dto,
      userId,
      lang,
    );
  }

  @Get('profile')
  async getFullStudentProfile(
    @GetUser('sub') userId: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.getStudentProfile(userId, lang);
  }

  @Delete('delete-profile')
  async deleteStudentProfile(
    @GetUser('sub') userId: number,
    @I18nLang() lang: string,
  ) {
    return this.regestrationService.deleteStudentProfile(userId, lang);
  }

}