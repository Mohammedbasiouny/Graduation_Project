import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { UpdateAutoReservationDto } from './dto/update-auto-reservation.dto';

@Injectable()
export class RestaurantSettingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly i18n: I18nService,
    ) { }

    private formatResponse(settings: any) {
        return {
            is_open: settings.is_open,
            auto_reservation_enabled: settings.auto_reservation_enabled,
            auto_reservation_target: settings.auto_reservation_target,
            updated_at: settings.updated_at,
        };
    }

    // =============================================================
    // Get Current Settings
    // =============================================================
    async getSettings() {
        try {
            const settings = await this.prisma.restaurantSettings.findUnique({
                where: { id: 1 },
            });

            if (!settings) {
                throw new NotFoundException('restaurant_settings.SETTINGS_NOT_FOUND');
            }

            return this.formatResponse(settings);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant_settings.FETCH_FAILED');
        }
    }

    // =============================================================
    // Toggle Restaurant Operational Status (Open/Closed)
    // =============================================================
    async toggleStatus(lang: string) {
        try {
            const currentSettings = await this.getSettings();
            const newStatus = !currentSettings.is_open;

            const updated = await this.prisma.restaurantSettings.update({
                where: { id: 1 },
                data: { is_open: newStatus },
            });

            const messageKey = newStatus
                ? 'restaurant_settings.STATUS_OPENED'
                : 'restaurant_settings.STATUS_CLOSED';

            return {
                data: this.formatResponse(updated),
                message: this.i18n.translate(messageKey, { lang }),
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant_settings.UPDATE_FAILED');
        }
    }

    // =============================================================
    // Update Auto-Reservation Settings
    // =============================================================
    async updateAutoReservation(dto: UpdateAutoReservationDto, lang: string) {
        try {
            await this.getSettings();

            const updated = await this.prisma.restaurantSettings.update({
                where: { id: 1 },
                data: {
                    auto_reservation_enabled: dto.enabled,
                    auto_reservation_target: dto.target,
                },
            });

            return this.formatResponse(updated);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant_settings.UPDATE_FAILED');
        }
    }
}