import { Module } from '@nestjs/common';
import { FacultiesModule } from './faculties/faculties.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [FacultiesModule, DepartmentsModule]
})
export class AcademicsModule {}
