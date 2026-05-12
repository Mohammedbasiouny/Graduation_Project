import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // ===========================================================
  // POST /api/rooms
  // ===========================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateRoomDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.roomsService.create(createDto);
    return this.responseHelper.success(data, 'dormitory.rooms.CREATED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // GET /api/rooms
  // Query params: building_id, type, available, page, page_size, with_pagination
  // ===========================================================
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @I18nLang() lang: string,
    @Query('building_id') buildingId?: string,
    @Query('type') type?: string,
    @Query('available') available?: string,
    @Query('page') page = 1,
    @Query('page_size') pageSize = 20,
    @Query('with_pagination') withPagination?: string,
  ) {
    let parsedAvailable: boolean | undefined = undefined;
    if (available === 'true') parsedAvailable = true;
    else if (available === 'false') parsedAvailable = false;

    const parsedBuildingId = buildingId ? parseInt(buildingId) : undefined;
    const safePage = Math.max(+page, 1);
    const safePageSize = Math.min(Math.max(+pageSize, 1), 50);
    const usePagination = withPagination?.toLowerCase() !== 'false';

    const result = await this.roomsService.findAll({
      buildingId: parsedBuildingId,
      type,
      available: parsedAvailable,
      page: safePage,
      pageSize: safePageSize,
      withPagination: usePagination,
    });

    return this.responseHelper.success(
      result.data,
      'dormitory.rooms.RETRIEVED_SUCCESSFULLY',
      lang,
      result.meta,
    );
  }

  // ===========================================================
  // GET /api/rooms/:id
  // ===========================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.roomsService.findOne(id);
    return this.responseHelper.success(data, 'dormitory.rooms.RETRIEVED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // PUT /api/rooms/:id
  // ===========================================================
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRoomDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.roomsService.update(id, updateDto);
    return this.responseHelper.success(data, 'dormitory.rooms.UPDATED_SUCCESSFULLY', lang);
  }

  // ===========================================================
  // DELETE /api/rooms/:id
  // ===========================================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    await this.roomsService.remove(id);
    return this.responseHelper.success(null, 'dormitory.rooms.DELETED_SUCCESSFULLY', lang);
  }
}