import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EducationalDepartmentsService } from './educational-departments.service';
import { CreateEducationalDepartmentDto, UpdateEducationalDepartmentDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Controller('api/admin/educational-departments')
export class EducationalDepartmentsController {
  constructor(
    private readonly educationalDepartmentsService: EducationalDepartmentsService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateEducationalDepartmentDto, @I18nLang() lang: string) {
    const data = await this.educationalDepartmentsService.create(createDto);
    return this.responseHelper.success(
      data,
      'locations.educational-departments.CREATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles()
  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @I18nLang() lang: string,
    @Query('governorate_id') governorateId?: string,
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
    @Query('with_pagination') withPagination?: string,
  ) {
    const safePage = Math.max(+(page || 1), 1);
    const safePageSize = Math.min(Math.max(+(pageSize || 20), 1), 50);

    const data = await this.educationalDepartmentsService.findAll(
      governorateId ? Number(governorateId) : undefined,
      safePage,
      safePageSize,
      withPagination?.toLowerCase() !== 'false',
    );
    return this.responseHelper.success(
      data.data,
      'locations.educational-departments.RETRIEVED_SUCCESSFULLY',
      lang,
      data.meta,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.educationalDepartmentsService.findOne(id);
    return this.responseHelper.success(
      data,
      'locations.educational-departments.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEducationalDepartmentDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.educationalDepartmentsService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'locations.educational-departments.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.educationalDepartmentsService.remove(id);
    return this.responseHelper.success(
      null,
      'locations.educational-departments.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}