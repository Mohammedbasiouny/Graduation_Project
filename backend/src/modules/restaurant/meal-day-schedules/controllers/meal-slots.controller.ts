import {
    Controller,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { MealSlotsService } from '../services/meal-slots.service';
import { CreateMealSlotDto, UpdateMealSlotDto } from '../dto/index';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/restaurant/meal-day-schedules/:scheduleId/slots')
export class MealSlotsController {
    constructor(
        private readonly mealSlotsService: MealSlotsService,
        private readonly responseHelper: ResponseHelper,
    ) { }

    // =============================================================
    // POST /api/cafeteria/meal-day-schedules/:scheduleId/slots
    // =============================================================
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Param('scheduleId', ParseIntPipe) scheduleId: number,
        @Body() createDto: CreateMealSlotDto,
        @I18nLang() lang: string,
    ) {
        const data = await this.mealSlotsService.create(scheduleId, createDto, lang);
        return this.responseHelper.success(
            data,
            'restaurant.meal_slots.CREATED_SUCCESSFULLY',
            lang,
        );
    }

    // =============================================================
    // PUT /api/cafeteria/meal-day-schedules/:scheduleId/slots/:slotId
    // =============================================================
    @Put(':slotId')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('scheduleId', ParseIntPipe) scheduleId: number,
        @Param('slotId', ParseIntPipe) slotId: number,
        @Body() updateDto: UpdateMealSlotDto,
        @I18nLang() lang: string,
    ) {
        const data = await this.mealSlotsService.update(scheduleId, slotId, updateDto, lang);
        return this.responseHelper.success(
            data,
            'restaurant.meal_slots.UPDATED_SUCCESSFULLY',
            lang,
        );
    }

    // =============================================================
    // DELETE /api/cafeteria/meal-day-schedules/:scheduleId/slots/:slotId
    // =============================================================
    @Delete(':slotId')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('scheduleId', ParseIntPipe) scheduleId: number,
        @Param('slotId', ParseIntPipe) slotId: number,
        @I18nLang() lang: string,
    ) {
        await this.mealSlotsService.remove(scheduleId, slotId, lang);
        return this.responseHelper.success(
            null,
            'restaurant.meal_slots.DELETED_SUCCESSFULLY',
            lang,
        );
    }
}