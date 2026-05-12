import { HttpException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { UpdateSettingsDto } from './dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  private parseTime(value: string): Date {
    return new Date(`1970-01-01T${value}.000Z`);
  }

  private formatTime(value: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}:${pad(value.getUTCSeconds())}`;
  }

  private mapSettingsResponse(settings: {
    id: number;
    restaurant_status: boolean;
    application_period_open: boolean;
    application_period_open_changed_at: Date;
    auto_meal_reserve: boolean;
    admission_results_announced: boolean;
    university_housing_started: boolean;
    female_visits_available: boolean;
    online_payment_available: boolean;
    attendance_start: Date;
    attendance_end: Date;
    updated_at: Date;
  }) {
    return {
      id: settings.id,
      restaurant_status: settings.restaurant_status,
      application_period_open: settings.application_period_open,
      application_period_open_changed_at: settings.application_period_open_changed_at,
      auto_meal_reserve: settings.auto_meal_reserve,
      admission_results_announced: settings.admission_results_announced,
      university_housing_started: settings.university_housing_started,
      female_visits_available: settings.female_visits_available,
      online_payment_available: settings.online_payment_available,
      attendance_start: this.formatTime(settings.attendance_start),
      attendance_end: this.formatTime(settings.attendance_end),
      updated_at: settings.updated_at,
    };
  }

  async onModuleInit() {
    // nothing needed here now
  }

  async getSettings(lang: string) {
    try {
      const settings = await this.prisma.settings.findFirst({
        orderBy: { id: 'asc' },
      });

      if (!settings) {
        throw new NotFoundException('settings.NOT_FOUND');
      }

      return this.responseHelper.success(
        this.mapSettingsResponse(settings),
        'settings.FETCHED',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('settings.FETCH_FAILED');
    }
  }

  async updateSettings(dto: UpdateSettingsDto, lang: string) {
    try {
      const settings = await this.prisma.settings.findFirst({
        orderBy: { id: 'asc' },
      });

      if (!settings) {
        throw new NotFoundException('settings.NOT_FOUND');
      }

      // Check if application_period_open changed
      const appPeriodChanged = settings.application_period_open !== dto.application_period_open;

      const updated = await this.prisma.settings.update({
        where: { id: settings.id },
        data: {
          restaurant_status: dto.restaurant_status,
          application_period_open: dto.application_period_open,
          application_period_open_changed_at: appPeriodChanged ? new Date() : settings.application_period_open_changed_at,
          auto_meal_reserve: dto.auto_meal_reserve,
          admission_results_announced: dto.admission_results_announced,
          university_housing_started: dto.university_housing_started,
          female_visits_available: dto.female_visits_available,
          online_payment_available: dto.online_payment_available,
          attendance_start: this.parseTime(dto.attendance_start),
          attendance_end: this.parseTime(dto.attendance_end),
        },
      });

      return this.responseHelper.success(
        this.mapSettingsResponse(updated),
        'settings.UPDATED',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('settings.UPDATE_FAILED');
    }
  }
}