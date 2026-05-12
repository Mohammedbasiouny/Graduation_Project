import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { AuditLogsService } from './audit-logs.service';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/audit-logs')
export class AuditLogsController {
    constructor(
        private readonly auditLogsService: AuditLogsService,
        private readonly responseHelper: ResponseHelper,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @I18nLang() lang: string,
        @Query('page') page = 1,
        @Query('page_size') pageSize = 20,
        @Query('with_pagination') withPagination?: string,
    ) {
        const safePage = Math.max(Number(page), 1);
        const safePageSize = Math.min(Math.max(Number(pageSize), 1), 100);
        const usePagination = withPagination?.toLowerCase() !== 'false';

        const result = await this.auditLogsService.findAllAuditLogs(
            safePage,
            safePageSize,
            usePagination,
        );

        return this.responseHelper.success(
            result.data,
            'audit-logs.LOGS_FETCHED_SUCCESSFULLY',
            lang,
            result.meta,
        );
    }
}
