import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuditLogsService } from './audit-logs.service';

@Module({
    imports: [PrismaModule],
    providers: [AuditLogsService],
    exports: [AuditLogsService],
})
export class AuditLogsModule { }
