import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RestaurantSettingsService } from './restaurant-settings.service';
import { UpdateAutoReservationDto } from './dto/update-auto-reservation.dto';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from '../../auth/roles';

// @Roles('cafeteria')
// @UseGuards(JwtGuard, RolesGuard)
@Controller('api/cafeteria/restaurant')
export class RestaurantSettingsController {
  constructor(
    private readonly restaurantSettingsService: RestaurantSettingsService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // =============================================================
  // GET /api/cafeteria/restaurant/status
  // =============================================================
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus(@I18nLang() lang: string) {
    const data = await this.restaurantSettingsService.getSettings();
    return this.responseHelper.success(
      data,
      'restaurant_settings.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // POST /api/cafeteria/restaurant/toggle-status
  // =============================================================
  @Post('toggle-status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@I18nLang() lang: string) {
    const { data, message } = await this.restaurantSettingsService.toggleStatus(lang);
    
    return this.responseHelper.success(data, message, lang);
  }

  // =============================================================
  // GET /api/cafeteria/restaurant/auto-reservation-status
  // =============================================================
  @Get('auto-reservation-status')
  @HttpCode(HttpStatus.OK)
  async getAutoReservationStatus(@I18nLang() lang: string) {
    const data = await this.restaurantSettingsService.getSettings();
    return this.responseHelper.success(
      data,
      'restaurant_settings.RETRIEVED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // POST /api/cafeteria/restaurant/auto-reservation-toggle
  // =============================================================
  @Post('auto-reservation-toggle')
  @HttpCode(HttpStatus.OK)
  async updateAutoReservation(
    @Body() dto: UpdateAutoReservationDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.restaurantSettingsService.updateAutoReservation(dto, lang);
    return this.responseHelper.success(
      data,
      'restaurant_settings.AUTO_RESERVATION_UPDATED',
      lang,
    );
  }
}