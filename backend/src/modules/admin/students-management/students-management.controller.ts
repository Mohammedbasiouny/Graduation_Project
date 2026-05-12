import { BadRequestException, Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { StudentsManagementService } from './students-management.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { I18nLang } from 'nestjs-i18n';
import { ExportStudentsDto } from './dto/export-students.dto';
import { ResponseHelper } from 'src/response-helper/response-helper';
import {
    PERMISSIONS,
    PermissionsGuard,
    RequirePermissions,
} from 'src/modules/auth/permissions';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard, PermissionsGuard)
@Controller('api/admin/students-management')
export class StudentsManagementController {
    constructor(
        private readonly studentsManagementService: StudentsManagementService,
        private readonly responseHelper: ResponseHelper
    ) { }

    @HttpCode(200)
    @Post('export-zip')
    async exportStudentsZip(
        @Body() dto: ExportStudentsDto,
        @Res({ passthrough: false }) res: Response,
    ) {
        await this.studentsManagementService.exportStudentsZip(dto, res);
    }

    @HttpCode(200)
    @Post('import-security-review')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!file.originalname.toLowerCase().match(/\.(xlsx|xls)$/)) {
                    return cb(
                        new BadRequestException('Only Excel files are allowed (.xlsx or .xls)'),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    )
    async importSecurityReview(@UploadedFile() file: Express.Multer.File, @I18nLang() lang: string) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.studentsManagementService.importSecurityReview(file, lang);
    }

    @Get("get-all")
    @HttpCode(200)
    async findAll(
        @I18nLang() lang: string,
        @Query('page') page = 1,
        @Query('page_size') pageSize = 10,
        @Query('with_pagination') withPagination = 'true',
    ) {

        const safePage = Math.max(Number(page), 1);
        const safePageSize = Math.min(Math.max(Number(pageSize), 1), 100);
        const data = await this.studentsManagementService.findAll(safePage, safePageSize, withPagination?.toLowerCase() !== 'false');
        return this.responseHelper.success(
            data.data,
            'students-management.STUDENTS_RETRIEVED_SUCCESSFULLY',
            lang,
            data.meta,
        );
    }

    @Get('profile-by-id/:id')
    async getFullStudentProfileById(
        @Param('id', ParseIntPipe) id: number,
        @I18nLang() lang: string,
    ) {
        return this.studentsManagementService.getStudentProfileByIdAdmin(id, lang);
    }

}
