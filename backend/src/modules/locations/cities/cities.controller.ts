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
import { CitiesService } from './cities.service';
import { CreateCityDto, UpdateCityDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Controller('api/admin/cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateCityDto, @I18nLang() lang: string) {
    const data = await this.citiesService.create(createDto);
    return this.responseHelper.success(
      data,
      'locations.cities.CREATED_SUCCESSFULLY',
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
    @Query('police_station_id') policeStationId?: string,
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
    @Query('with_pagination') withPagination?: string,
  ) {
    const safePage = Math.max(+(page || 1), 1);
    const safePageSize = Math.min(Math.max(+(pageSize || 20), 1), 50);

    const data = await this.citiesService.findAll(
      governorateId ? Number(governorateId) : undefined,
      policeStationId ? Number(policeStationId) : undefined,
      safePage,
      safePageSize,
      withPagination?.toLowerCase() !== 'false',
    );
    return this.responseHelper.success(
      data.data,
      'locations.cities.RETRIEVED_SUCCESSFULLY',
      lang,
      data.meta,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.citiesService.findOne(id);
    return this.responseHelper.success(
      data,
      'locations.cities.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCityDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.citiesService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'locations.cities.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.citiesService.remove(id);
    return this.responseHelper.success(
      null,
      'locations.cities.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}