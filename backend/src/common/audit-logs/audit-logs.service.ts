import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogInput } from './audit-logs.types';

@Injectable()
export class AuditLogsService {
    private readonly logger = new Logger(AuditLogsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createAuditLog(data: AuditLogInput): Promise<void> {
        try {
            await this.prisma.auditLog.create({
                data,
            });
        } catch (error) {
            this.logger.error(
                'Failed to persist audit log',
                error instanceof Error ? error.stack : undefined,
            );
        }
    }
}
