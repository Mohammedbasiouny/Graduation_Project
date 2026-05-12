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
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto, UpdateMealDto } from './dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/restaurant/meals')
export class MealsController {
  constructor(
    private readonly mealsService: MealsService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // =============================================================
  // POST /api/cafeteria/meals
  // =============================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateMealDto, @I18nLang() lang: string) {
    const data = await this.mealsService.create(createDto, lang);
    return this.responseHelper.success(data, 'restaurant.meals.CREATED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // GET /api/cafeteria/meals
  // =============================================================
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

    const result = await this.mealsService.findAll(
      safePage,
      safePageSize,
      withPagination?.toLowerCase() !== 'false',
    );

    return this.responseHelper.success(result.data, 'restaurant.meals.RETRIEVED_SUCCESSFULLY', lang, result.meta);
  }

  // =============================================================
  // GET /api/cafeteria/meals/:id
  // =============================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    const data = await this.mealsService.findOne(id);
    return this.responseHelper.success(data, 'restaurant.meals.RETRIEVED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // PUT /api/cafeteria/meals/:id
  // =============================================================
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMealDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.mealsService.update(id, updateDto, lang);
    return this.responseHelper.success(data, 'restaurant.meals.UPDATED_SUCCESSFULLY', lang);
  }

  // =============================================================
  // DELETE /api/cafeteria/meals/:id
  // =============================================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @I18nLang() lang: string) {
    await this.mealsService.remove(id);
    return this.responseHelper.success(null, 'restaurant.meals.DELETED_SUCCESSFULLY', lang);
  }
}