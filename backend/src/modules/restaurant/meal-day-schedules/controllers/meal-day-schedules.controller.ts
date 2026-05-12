import {
  Controller,
  Post,
  Get,
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
import { MealDaySchedulesService } from '../services/meal-day-schedules.service';
import { CreateMealDayScheduleDto, UpdateMealDayScheduleDto } from '../dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/restaurant/meal-day-schedules')
export class MealDaySchedulesController {
  constructor(
    private readonly mealDaySchedulesService: MealDaySchedulesService,
    private readonly responseHelper: ResponseHelper,
  ) { }

  // =============================================================
  // POST /api/cafeteria/meal-day-schedules
  // =============================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateMealDayScheduleDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.mealDaySchedulesService.create(createDto, lang);
    return this.responseHelper.success(
      data,
      'restaurant.meal_day_schedules.CREATED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // GET /api/cafeteria/meal-day-schedules
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

    const result = await this.mealDaySchedulesService.findAll(
      safePage,
      safePageSize,
      withPagination?.toLowerCase() !== 'false',
    );

    return this.responseHelper.success(
      result.data,
      'restaurant.meal_day_schedules.RETRIEVED_SUCCESSFULLY',
      lang,
      result.meta,
    );
  }

  // =============================================================
  // GET /api/cafeteria/meal-day-schedules/:id
  // =============================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.mealDaySchedulesService.findOne(id);
    return this.responseHelper.success(
      data,
      'restaurant.meal_day_schedules.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // PUT /api/cafeteria/meal-day-schedules/:id
  // =============================================================
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMealDayScheduleDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.mealDaySchedulesService.update(id, updateDto, lang);
    return this.responseHelper.success(
      data,
      'restaurant.meal_day_schedules.UPDATED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // DELETE /api/cafeteria/meal-day-schedules/:id
  // =============================================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    await this.mealDaySchedulesService.remove(id, lang);
    return this.responseHelper.success(
      null,
      'restaurant.meal_day_schedules.DELETED_SUCCESSFULLY',
      lang,
    );
  }
}