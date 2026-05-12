import { Module } from '@nestjs/common';
import { RegestrationService } from './regestration.service';
import { RegestrationController } from './regestration.controller';
import { FileModule } from 'src/common/file-service/file.module';
import { PeriodGuardHelper } from './helpers/period.guard.helper';
import { DocumentHelper } from './helpers/document.helper';
import { ValidationErrorHelper } from './helpers/validation-error.helper';

// validators
import { EgyptianIdValidator } from './validators/egyptian-id.validator';
import { AddressValidator } from './validators/address.validator';

// sections
import { PersonalInfoService } from './sections/personal-info.service';
import { ResidenceInfoService } from './sections/residence-info.service';
import { PreUniversityService } from './sections/pre-university.service';
import { AcademicInfoService } from './sections/academic-info.service';
import { GuardianInfoService } from './sections/guardian-info.service';
import { ParentsInfoService } from './sections/parents-info.service';
import { StudentProfileService } from './sections/student-profile.service';

@Module({
  imports: [FileModule],
  controllers: [RegestrationController],
  providers: [RegestrationService,
    PeriodGuardHelper,
    DocumentHelper,
    ValidationErrorHelper,

    // validators
    EgyptianIdValidator,
    AddressValidator,

    // sections
    PersonalInfoService,
    ResidenceInfoService,
    PreUniversityService,
    AcademicInfoService,
    GuardianInfoService,
    ParentsInfoService,
    StudentProfileService,
  ],
})
export class RegestrationModule { }
