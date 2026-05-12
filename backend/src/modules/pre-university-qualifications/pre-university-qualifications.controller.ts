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
import { PreUniversityQualificationsService } from './pre-university-qualifications.service';
import { CreatePreUniversityQualificationDto, UpdatePreUniversityQualificationDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../auth/roles';

@Controller('api/admin/pre-university-qualifications')
export class PreUniversityQualificationsController {
  constructor(
    private readonly preUniversityQualificationsService: PreUniversityQualificationsService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreatePreUniversityQualificationDto, @I18nLang() lang: string) {
    const data = await this.preUniversityQualificationsService.create(createDto);
    return this.responseHelper.success(
      data,
      'pre-university-qualifications.CREATED_SUCCESSFULLY',
      lang,
    );
  }


  @Roles()
  @UseGuards(JwtGuard)
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

    const result =
      await this.preUniversityQualificationsService.findAll(
        safePage,
        safePageSize,
        withPagination?.toLowerCase() !== 'false',
      );

    return this.responseHelper.success(
      result.data,
      'pre-university-qualifications.RETRIEVED_SUCCESSFULLY',
      lang,
      result.meta,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.preUniversityQualificationsService.findOne(id);
    return this.responseHelper.success(
      data,
      'pre-university-qualifications.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePreUniversityQualificationDto, @I18nLang() lang: string) {
    const data = await this.preUniversityQualificationsService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'pre-university-qualifications.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.preUniversityQualificationsService.remove(id);
    return this.responseHelper.success(
      null,
      'pre-university-qualifications.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}
