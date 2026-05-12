import { Module } from '@nestjs/common';
import { MealsModule } from './meals/meals.module';
import { RestaurantSettingsModule } from './restaurant-settings/restaurant-settings.module';
import { MealDaySchedulesModule } from './meal-day-schedules/meal-day-schedules.module';
import { ReservationsModule } from './reservations/reservations.module';
@Module({
  imports: [MealsModule, RestaurantSettingsModule, MealDaySchedulesModule, ReservationsModule]
})
export class RestaurantModule {}
