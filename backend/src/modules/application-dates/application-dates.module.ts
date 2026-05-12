import { Module } from '@nestjs/common';
import { ApplicationDatesService } from './application-dates.service';
import { ApplicationDatesAdminController } from './controller/application-dates.admin.controller';
import { ApplicationDatesStudentController } from './controller/application-dates.student.controller';
import { ApplicationDatesController } from './controller/application-dates.controller';

@Module({
  controllers: [
    ApplicationDatesAdminController,
    ApplicationDatesStudentController,
    ApplicationDatesController

  ],
  providers: [ApplicationDatesService],
  exports: [ApplicationDatesService],
})
export class ApplicationDatesModule { }
