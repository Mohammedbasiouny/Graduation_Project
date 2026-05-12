import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MedicalReportService } from './medical-report.service';
import { CreateMedicalReportDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { GetUser } from 'src/modules/auth/decorator';

@Controller('api')
export class MedicalReportController {
  constructor(
    private readonly medicalReportService: MedicalReportService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  // =============================================================
  // Student: Create or Update their own medical report
  // =============================================================
  @Roles('student')
  @UseGuards(JwtGuard, RolesGuard)
  @Post('register/medical-report')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createDto: CreateMedicalReportDto,
    @GetUser('sub') userId: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.medicalReportService.create(userId, createDto);
    return this.responseHelper.success(data, 'medical.REPORT_CREATED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // Admin/Medical: Get all medical reports
  // =============================================================
  @Roles('admin', 'medical')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin/medical-reports')
  @HttpCode(HttpStatus.OK)
  async findAll(@I18nLang() lang: string) {
    const data = await this.medicalReportService.findAll();
    return this.responseHelper.success(data, 'medical.REPORTS_RETRIEVED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // Admin/Medical: Get medical report by ID
  // =============================================================
  @Roles('admin', 'medical')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin/medical-reports/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.medicalReportService.findOne(id);
    return this.responseHelper.success(data, 'medical.REPORT_RETRIEVED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // Admin/Medical: Get medical report by student ID
  // =============================================================
  @Roles('admin', 'medical')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin/students/:studentId/medical-report')
  @HttpCode(HttpStatus.OK)
  async findByStudentId(
    @Param('studentId', ParseIntPipe) studentId: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.medicalReportService.findByStudentId(studentId);
    return this.responseHelper.success(data, 'medical.REPORT_RETRIEVED_SUCCESSFULLY', lang);
  }
}