import { Module } from '@nestjs/common';
import { MedicalReportService } from './medical-report.service';
import { MedicalReportController } from './medical-report.controller';

@Module({
  controllers: [MedicalReportController],
  providers: [MedicalReportService],
  exports: [MedicalReportService],
})
export class MedicalReportModule {}
