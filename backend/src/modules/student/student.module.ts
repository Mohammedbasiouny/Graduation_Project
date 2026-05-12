import { Module } from '@nestjs/common';
import { RegestrationModule } from './regestration/regestration.module';
import { MedicalReportModule } from './medical-report/medical-report.module';

@Module({
    imports: [
        RegestrationModule,
        MedicalReportModule,
    ],
})
export class StudentModule {}
