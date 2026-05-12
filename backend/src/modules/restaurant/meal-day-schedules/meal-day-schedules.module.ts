import { Module } from '@nestjs/common';
import { MealDaySchedulesService } from './services/meal-day-schedules.service';
import { MealSlotsService } from './services/meal-slots.service';
import { MealDaySchedulesController } from './controllers/meal-day-schedules.controller';
import { MealSlotsController } from './controllers/meal-slots.controller';

@Module({
  controllers: [
    MealDaySchedulesController,
    MealSlotsController,
  ],
  providers: [
    MealDaySchedulesService,
    MealSlotsService,
  ],
})
export class MealDaySchedulesModule {}