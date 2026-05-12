import { Module } from '@nestjs/common';
import { PreUniversityQualificationsService } from './pre-university-qualifications.service';
import { PreUniversityQualificationsController } from './pre-university-qualifications.controller';

@Module({
  controllers: [PreUniversityQualificationsController],
  providers: [PreUniversityQualificationsService],
})
export class PreUniversityQualificationsModule { }
