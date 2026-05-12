import { Module } from '@nestjs/common';
import { EducationalDepartmentsService } from './educational-departments.service';
import { EducationalDepartmentsController } from './educational-departments.controller';

@Module({
  controllers: [EducationalDepartmentsController],
  providers: [EducationalDepartmentsService],
})
export class EducationalDepartmentsModule {}