import { Module } from '@nestjs/common';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { StudentsManagementModule } from './students-management/students-management.module';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [StudentsManagementModule, UserManagementModule, AuditLogsModule]
})
export class AdminModule {}
