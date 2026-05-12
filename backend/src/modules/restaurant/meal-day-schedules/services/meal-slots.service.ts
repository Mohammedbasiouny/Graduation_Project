import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    HttpException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { CreateMealSlotDto, UpdateMealSlotDto } from '../dto/index';

@Injectable()
export class MealSlotsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly i18n: I18nService,
    ) { }

    // =============================================================
    // Format Response
    // =============================================================
    private formatResponse(slot: any) {
        return {
            id: slot.id,
            schedule_id: slot.schedule_id,
            meal_id: slot.meal_id,
            delivery_start_time: slot.delivery_start_time,
            delivery_end_time: slot.delivery_end_time,
        };
    }

    // =============================================================
    // Create Meal Slot
    // =============================================================
    async create(scheduleId: number, createDto: CreateMealSlotDto, lang: string) {
        try {
            // ── Parent schedule existence check ──
            const schedule = await this.prisma.mealDaySchedule.findUnique({
                where: { id: scheduleId },
                include: { slots: { include: { meal: true } } },
            });

            if (!schedule) throw new NotFoundException('restaurant.meal_day_schedules.NOT_FOUND');

            // ── Schedule lock check ──
            const earliestSlot = schedule.slots.sort(
                (a, b) => a.delivery_start_time.getTime() - b.delivery_start_time.getTime(),
            )[0];

            if (earliestSlot && new Date() >= earliestSlot.delivery_start_time) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        schedule_id: [
                            this.i18n.translate('restaurant.meal_slots.SLOT_LOCKED', { lang }),
                        ],
                    },
                });
            }

            // ── Meal existence & active check ──
            const meal = await this.prisma.meal.findUnique({ where: { id: createDto.meal_id } });

            if (!meal) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        meal_id: [this.i18n.translate('restaurant.meal_slots.MEAL_NOT_FOUND', { lang })],
                    },
                });
            }

            if (!meal.is_active) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        meal_id: [this.i18n.translate('restaurant.meal_slots.MEAL_INACTIVE', { lang })],
                    },
                });
            }

            const deliveryStart = new Date(createDto.delivery_start_time);
            const deliveryEnd = new Date(createDto.delivery_end_time);
            const bookingEnd = schedule.booking_end_time;
            const errors: Record<string, string[]> = {};

            // ── Delivery start before end ──
            if (deliveryStart >= deliveryEnd) {
                errors['delivery_end_time'] = [
                    this.i18n.translate('restaurant.meal_slots.DELIVERY_START_BEFORE_END', { lang }),
                ];
            }

            // ── Booking must precede delivery ──
            if (bookingEnd >= deliveryStart) {
                errors['delivery_start_time'] = [
                    this.i18n.translate('restaurant.meal_slots.BOOKING_MUST_PRECEDE_DELIVERY', { lang }),
                ];
            }

            // ── Kitchen prep gap — minimum 2 hours ──
            const prepGapMs = deliveryStart.getTime() - bookingEnd.getTime();
            if (prepGapMs < 2 * 60 * 60 * 1000) {
                errors['delivery_start_time'] = [
                    ...(errors['delivery_start_time'] || []),
                    this.i18n.translate('restaurant.meal_slots.KITCHEN_PREP_TIME_INSUFFICIENT', { lang }),
                ];
            }

            // ── Duplicate category check ──
            const categoryExists = schedule.slots.some(
                (s) => s.meal.category === meal.category,
            );

            if (categoryExists) {
                errors['meal_id'] = [
                    this.i18n.translate('restaurant.meal_slots.DUPLICATE_CATEGORY_SAME_DAY', { lang }),
                ];
            }

            if (Object.keys(errors).length > 0) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors,
                });
            }

            const slot = await this.prisma.mealSlot.create({
                data: {
                    schedule_id: scheduleId,
                    meal_id: createDto.meal_id,
                    delivery_start_time: deliveryStart,
                    delivery_end_time: deliveryEnd,
                },
            });

            return this.formatResponse(slot);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_slots.CREATE_FAILED');
        }
    }

    // =============================================================
    // Update Meal Slot
    // =============================================================
    async update(scheduleId: number, slotId: number, updateDto: UpdateMealSlotDto, lang: string) {
        try {
            const slot = await this.prisma.mealSlot.findFirst({
                where: { id: slotId, schedule_id: scheduleId },
            });

            if (!slot) throw new NotFoundException('restaurant.meal_slots.NOT_FOUND');

            // ── Slot lock check ──
            if (new Date() >= slot.delivery_start_time) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        delivery_start_time: [
                            this.i18n.translate('restaurant.meal_slots.SLOT_LOCKED', { lang }),
                        ],
                    },
                });
            }

            // ── Fetch parent schedule for booking_end ──
            const schedule = await this.prisma.mealDaySchedule.findUnique({
                where: { id: scheduleId },
            });

            const mergedDeliveryStart = updateDto.delivery_start_time
                ? new Date(updateDto.delivery_start_time)
                : slot.delivery_start_time;

            const mergedDeliveryEnd = updateDto.delivery_end_time
                ? new Date(updateDto.delivery_end_time)
                : slot.delivery_end_time;

            const bookingEnd = schedule.booking_end_time;
            const errors: Record<string, string[]> = {};

            // ── Delivery start before end ──
            if (mergedDeliveryStart >= mergedDeliveryEnd) {
                errors['delivery_end_time'] = [
                    this.i18n.translate('restaurant.meal_slots.DELIVERY_START_BEFORE_END', { lang }),
                ];
            }

            // ── Booking must precede delivery ──
            if (bookingEnd >= mergedDeliveryStart) {
                errors['delivery_start_time'] = [
                    this.i18n.translate('restaurant.meal_slots.BOOKING_MUST_PRECEDE_DELIVERY', { lang }),
                ];
            }

            // ── Kitchen prep gap — minimum 2 hours ──
            const prepGapMs = mergedDeliveryStart.getTime() - bookingEnd.getTime();
            if (prepGapMs < 2 * 60 * 60 * 1000) {
                errors['delivery_start_time'] = [
                    ...(errors['delivery_start_time'] || []),
                    this.i18n.translate('restaurant.meal_slots.KITCHEN_PREP_TIME_INSUFFICIENT', { lang }),
                ];
            }

            if (Object.keys(errors).length > 0) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors,
                });
            }

            const updateData: any = {};
            if (updateDto.delivery_start_time !== undefined) updateData.delivery_start_time = mergedDeliveryStart;
            if (updateDto.delivery_end_time !== undefined) updateData.delivery_end_time = mergedDeliveryEnd;

            const updated = await this.prisma.mealSlot.update({
                where: { id: slotId },
                data: updateData,
            });

            return this.formatResponse(updated);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_slots.UPDATE_FAILED');
        }
    }

    // =============================================================
    // Delete Meal Slot
    // =============================================================
    async remove(scheduleId: number, slotId: number, lang: string) {
        try {
            const slot = await this.prisma.mealSlot.findFirst({
                where: { id: slotId, schedule_id: scheduleId },
            });

            if (!slot) throw new NotFoundException('restaurant.meal_slots.NOT_FOUND');

            // ── Slot lock check ──
            if (new Date() >= slot.delivery_start_time) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        delivery_start_time: [
                            this.i18n.translate('restaurant.meal_slots.SLOT_LOCKED', { lang }),
                        ],
                    },
                });
            }

            await this.prisma.mealSlot.delete({ where: { id: slotId } });
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_slots.DELETE_FAILED');
        }
    }
}