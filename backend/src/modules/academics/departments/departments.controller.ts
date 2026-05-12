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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Controller('api/admin/departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateDepartmentDto, @I18nLang() lang: string) {
    const data = await this.departmentsService.create(createDto);
    return this.responseHelper.success(
      data,
      'academics.departments.CREATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles()
  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @I18nLang() lang: string,
    @Query('faculty_id') facultyId?: string,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string = '20',
    @Query('with_pagination') withPagination: string = 'true',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSizeNumber = parseInt(pageSize, 10) || 20;
    const isPaginated = withPagination !== 'false';

    const data = await this.departmentsService.findAll({
      page: pageNumber,
      pageSize: pageSizeNumber,
      withPagination: isPaginated,
      facultyId: facultyId ? Number(facultyId) : undefined,
    });
    return this.responseHelper.success(
      data.data,
      'academics.departments.RETRIEVED_SUCCESSFULLY',
      lang,
      data.meta,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.departmentsService.findOne(id);
    return this.responseHelper.success(
      data,
      'academics.departments.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }


  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDepartmentDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.departmentsService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'academics.departments.UPDATED_SUCCESSFULLY',
      lang,
    );
  }


  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.departmentsService.remove(id);
    return this.responseHelper.success(
      null,
      'academics.departments.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}