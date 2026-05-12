import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsGuard } from 'src/modules/auth/permissions';

@Module({
  controllers: [UserManagementController],
  providers: [UserManagementService, PermissionsGuard],
  imports: [
    AuthModule,
  ],
})
export class UserManagementModule { }
