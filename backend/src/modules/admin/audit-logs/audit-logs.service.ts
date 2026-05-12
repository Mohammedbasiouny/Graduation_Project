import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditLogsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllAuditLogs(
        page: number,
        pageSize: number,
        withPagination: boolean,
    ) {
        try {
            const select = {
                id: true,
                role: true,
                action: true,
                method: true,
                endpoint: true,
                ip_address: true,
                user_agent: true,
                status_code: true,
                status: true,
                message: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        role: true,
                    },
                },
            } as unknown as Prisma.AuditLogSelect;

            if (!withPagination) {
                const logs = await this.prisma.auditLog.findMany({
                    select,
                    orderBy: { created_at: 'desc' },
                });

                return {
                    data: logs.map((log) => ({
                        id: log.id,
                        user_id: log.user?.id ?? null,
                        user_name: log.user?.full_name ?? null,
                        user_email: log.user?.email ?? null,
                        role: log.role,
                        action: log.action,
                        method: log.method,
                        endpoint: log.endpoint,
                        ip_address: log.ip_address,
                        user_agent: log.user_agent,
                        status_code: log.status_code,
                        status: (log as any).status,
                        error_message: (log as any).message,
                        created_at: log.created_at,
                    })),
                    meta: {
                        pagination: {
                            page: 1,
                            page_size: logs.length,
                            total_pages: 1,
                            total_items: logs.length,
                        },
                        filters: null,
                        search: null,
                        sorting: null,
                    },
                };
            }

            const skip = (page - 1) * pageSize;

            const [logs, totalItems] = await this.prisma.$transaction([
                this.prisma.auditLog.findMany({
                    select,
                    skip,
                    take: pageSize,
                    orderBy: { created_at: 'desc' },
                }),
                this.prisma.auditLog.count(),
            ]);

            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                data: logs.map((log) => ({
                    id: log.id,
                    user_id: log.user?.id ?? null,
                    user_name: log.user?.full_name ?? null,
                    user_email: log.user?.email ?? null,
                    role: log.role,
                    action: log.action,
                    method: log.method,
                    endpoint: log.endpoint,
                    ip_address: log.ip_address,
                    user_agent: log.user_agent,
                    status_code: log.status_code,
                    status: (log as any).status,
                    error_message: (log as any).message,
                    created_at: log.created_at,
                })),
                meta: {
                    pagination: {
                        page,
                        page_size: pageSize,
                        total_pages: totalPages,
                        total_items: totalItems,
                    },
                    filters: null,
                    search: null,
                    sorting: null,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;

            throw new InternalServerErrorException('common.ERROR');
        }
    }
}
