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
import { GovernoratesService } from './governorates.service';
import { CreateGovernorateDto, UpdateGovernorateDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Controller('api/admin/governorates')
export class GovernoratesController {
  constructor(
    private readonly governoratesService: GovernoratesService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateGovernorateDto, @I18nLang() lang: string) {
    const data = await this.governoratesService.create(createDto);
    return this.responseHelper.success(
      data,
      'locations.governorates.CREATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get("statistics-about-egypt")
  @HttpCode(HttpStatus.OK)
  async statistics(
    @I18nLang() lang: string,
  ) {
    const data = await this.governoratesService.getStatisticsAboutEgypt();
    return this.responseHelper.success(
      data,
      'locations.governorates.RETRIEVED_SUCCESSFULLY',
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
    @Query('page_size') pageSize = 10,
    @Query('with_pagination') withPagination = 'true',
  ) {

    const safePage = Math.max(Number(page), 1);
    const safePageSize = Math.min(Math.max(Number(pageSize), 1), 100);
    const data = await this.governoratesService.findAll(safePage, safePageSize, withPagination?.toLowerCase() !== 'false');
    return this.responseHelper.success(
      data.data,
      'locations.governorates.RETRIEVED_SUCCESSFULLY',
      lang,
      data.meta
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.governoratesService.findOne(id);
    return this.responseHelper.success(
      data,
      'locations.governorates.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGovernorateDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.governoratesService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'locations.governorates.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.governoratesService.remove(id);
    return this.responseHelper.success(
      null,
      'locations.governorates.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}
