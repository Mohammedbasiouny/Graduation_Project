import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApplicationDatesService } from '../application-dates.service';
import { CreateApplicationDateDto, UpdateApplicationDateDto } from '../dto';
import { I18nLang } from 'nestjs-i18n';
import { Roles, RolesGuard } from '../../auth/roles';
import { JwtGuard } from '../../auth/guard';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/application-dates')
export class ApplicationDatesAdminController {
    constructor(
        private readonly service: ApplicationDatesService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @I18nLang() lang: string,
        @Query('page') page = 1,
        @Query('page_size') pageSize = 20,
        @Query('with_pagination') withPagination?: string,
    ) {
        const safePage = Math.max(+page, 1);
        const safePageSize = Math.min(Math.max(+pageSize, 1), 50);
        const usePagination = withPagination?.toLowerCase() !== 'false';

        return this.service.findAll({
            lang,
            page: safePage,
            pageSize: safePageSize,
            withPagination: usePagination,
        });
    }

    @Get('statistics')
    @HttpCode(HttpStatus.OK)
    async getStatistics(
        @I18nLang() lang: string,
    ) {
        return this.service.getStatistics(lang);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @I18nLang() lang: string,
    ) {
        return this.service.findOne(id, lang);
    }


    @Post()
    create(
        @Body() dto: CreateApplicationDateDto,
        @I18nLang() lang: string,
    ) {
        return this.service.create(dto, lang);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplicationDateDto,
        @I18nLang() lang: string,
    ) {
        return this.service.update(id, dto, lang);
    }

    @Delete('truncate')
    truncateTable(
        @I18nLang() lang: string
    ) {
        return this.service.truncateTable(lang);
    }

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @I18nLang() lang: string,
    ) {
        return this.service.delete(id, lang);
    }

    @Patch('period/toggle-status')
    toggleStatus(
        @I18nLang() lang: string
    ) {
        return this.service.toggleStatus(lang);
    }

    @Patch(':id/toggle-preliminary-result-announced')
    async togglePreliminaryResultAnnounced(
        @Param('id', ParseIntPipe) id: number,
        @I18nLang() lang: string,
    ) {
        return this.service.togglePreliminaryResultAnnounced(id, lang);
    }
}