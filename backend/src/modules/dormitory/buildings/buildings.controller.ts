import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/buildings')
export class BuildingsController {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  // ===========================================================
  // POST /api/buildings
  // ===========================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateBuildingDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.buildingsService.create(createDto);
    return this.responseHelper.success(data, 'dormitory.buildings.CREATED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // GET /api/buildings
  // ===========================================================
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @I18nLang() lang: string,
    @Query('type') type?: string,
    @Query('available') available?: string,
    @Query('page') page = 1,
    @Query('page_size') pageSize = 20,
    @Query('with_pagination') withPagination?: string,
  ) {
    let parsedAvailable: boolean | undefined = undefined;
    if (available === 'true') parsedAvailable = true;
    else if (available === 'false') parsedAvailable = false;

    const safePage = Math.max(+page, 1);
    const safePageSize = Math.min(Math.max(+pageSize, 1), 50);
    const usePagination = withPagination?.toLowerCase() !== 'false';

    const result = await this.buildingsService.findAll({
      type,
      available: parsedAvailable,
      page: safePage,
      pageSize: safePageSize,
      withPagination: usePagination,
    });

    return this.responseHelper.success(
      result.data,
      'dormitory.buildings.RETRIEVED_SUCCESSFULLY',
      lang,
      result.meta,
    );
  }

  // ===========================================================
  // GET /api/buildings/:id
  // ===========================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.buildingsService.findOne(id);
    return this.responseHelper.success(data, 'dormitory.buildings.RETRIEVED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // PUT /api/buildings/:id
  // ===========================================================
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBuildingDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.buildingsService.update(id, updateDto);
    return this.responseHelper.success(data, 'dormitory.buildings.UPDATED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // DELETE /api/buildings/:id
  // ===========================================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    await this.buildingsService.remove(id);
    return this.responseHelper.success(null, 'dormitory.buildings.DELETED_SUCCESSFULLY', lang);
  }
}