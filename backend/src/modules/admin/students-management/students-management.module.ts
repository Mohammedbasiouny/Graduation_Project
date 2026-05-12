import { Module } from '@nestjs/common';
import { StudentsManagementService } from './students-management.service';
import { StudentsManagementController } from './students-management.controller';
import { PermissionsGuard } from 'src/modules/auth/permissions';
import { StudentsListService } from './sections/students-list.service';
import { ImportService } from './sections/import.service';
import { ExportService } from './sections/export.service';
import { StudentMapperHelper } from './helpers/student-mapper.helper';
import { StudentCompletionHelper } from './helpers/student-completion.helper';
import { ExcelHeaderHelper } from './helpers/excel-header.helper';

@Module({
  providers: [StudentsManagementService,
    PermissionsGuard,
    ExcelHeaderHelper,
    StudentCompletionHelper,
    StudentMapperHelper,
    ExportService,
    ImportService,
    StudentsListService,],
  controllers: [StudentsManagementController]
})
export class StudentsManagementModule { }
