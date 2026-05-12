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
import { PoliceDepartmentsService } from './police-departments.service';
import { CreatePoliceDepartmentDto, UpdatePoliceDepartmentDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Controller('api/admin/police-stations')
export class PoliceDepartmentsController {
  constructor(
    private readonly policeDepartmentsService: PoliceDepartmentsService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreatePoliceDepartmentDto, @I18nLang() lang: string) {
    const data = await this.policeDepartmentsService.create(createDto);
    return this.responseHelper.success(
      data,
      'locations.police-departments.CREATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles()
  @UseGuards(JwtGuard)
  @Get()
  async getPoliceStations(
    @I18nLang() lang: string,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string = '20',
    @Query('governorate_id', new ParseIntPipe({ optional: true })) governorateId?: number,
    @Query('with_pagination') withPagination?: string,
  ) {

    const safePage = Math.max(+page, 1);
    const safePageSize = Math.min(Math.max(+pageSize, 1), 50);
    const data = await this.policeDepartmentsService.getPoliceStations(safePage, safePageSize, governorateId, withPagination?.toLowerCase() !== 'false');

    return this.responseHelper.success(
      data.data,
      'locations.police-departments.POLICE_STATIONS_RETRIEVED',
      lang,
      data.meta
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.policeDepartmentsService.findOne(id);
    return this.responseHelper.success(
      data,
      'locations.police-departments.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePoliceDepartmentDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.policeDepartmentsService.update(id, updateDto);
    return this.responseHelper.success(
      data,
      'locations.police-departments.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.policeDepartmentsService.remove(id);
    return this.responseHelper.success(
      null,
      'locations.police-departments.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}
