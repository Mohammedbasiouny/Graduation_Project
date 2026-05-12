import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    HttpException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { CreateMealDayScheduleDto, UpdateMealDayScheduleDto } from '../dto/index';

@Injectable()
export class MealDaySchedulesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly i18n: I18nService,
    ) { }

    // =============================================================
    // Format Response — summary (used in findAll)
    // =============================================================
    private formatSummary(schedule: any) {
        return {
            id: schedule.id,
            day_type: schedule.day_type,
            booking_start_time: schedule.booking_start_time,
            booking_end_time: schedule.booking_end_time,
            slots_count: schedule._count.slots,
        };
    }

    // =============================================================
    // Format Response — full (used in findOne & create)
    // =============================================================
    private formatFull(schedule: any) {
        return {
            id: schedule.id,
            day_type: schedule.day_type,
            booking_start_time: schedule.booking_start_time,
            booking_end_time: schedule.booking_end_time,
            notes: schedule.notes,
            meals: schedule.slots?.map((slot: any) => ({
                id: slot.id,
                meal_id: slot.meal_id,
                delivery_start_time: slot.delivery_start_time,
                delivery_end_time: slot.delivery_end_time,
            })),
        };
    }

    // =============================================================
    // Validate Booking Window (schedule-level)
    // =============================================================
    private validateBookingWindow(
        bookingStartRaw: string,
        bookingEndRaw: string,
        lang: string,
    ) {
        const bookingStart = new Date(bookingStartRaw);
        const bookingEnd = new Date(bookingEndRaw);
        const now = new Date();
        const errors: Record<string, string[]> = {};

        // ── (1) Must be in the future ──
        if (bookingStart <= now || bookingEnd <= now) {
            errors['booking_start_time'] = [
                this.i18n.translate('restaurant.meal_day_schedules.SCHEDULE_MUST_BE_FUTURE', { lang }),
            ];
        }

        // ── (2) Start must be before end ──
        if (bookingStart >= bookingEnd) {
            errors['booking_end_time'] = [
                this.i18n.translate('restaurant.meal_day_schedules.BOOKING_START_BEFORE_END', { lang }),
            ];
        }

        // ── (3) Minimum 1 hour booking window ──
        const bookingDurationMs = bookingEnd.getTime() - bookingStart.getTime();
        if (bookingDurationMs < 60 * 60 * 1000) {
            errors['booking_end_time'] = [
                ...(errors['booking_end_time'] || []),
                this.i18n.translate('restaurant.meal_day_schedules.BOOKING_WINDOW_TOO_SHORT', { lang }),
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

        return { bookingStart, bookingEnd };
    }

    // =============================================================
    // Create Meal Day Schedule
    // =============================================================
    async create(createDto: CreateMealDayScheduleDto, lang: string) {
        try {
            // ── Validate booking window ──
            const { bookingEnd } = this.validateBookingWindow(
                createDto.booking_start_time,
                createDto.booking_end_time,
                lang,
            );

            // ── Validate each slot & check meal existence, active status, category duplicate ──
            const errors: Record<string, string[]> = {};
            const seenCategories = new Set<string>();

            for (let i = 0; i < createDto.meals.length; i++) {
                const slot = createDto.meals[i];
                const deliveryStart = new Date(slot.delivery_start_time);
                const deliveryEnd = new Date(slot.delivery_end_time);
                const prefix = `meals.${i}`;

                // Meal existence & active
                const meal = await this.prisma.meal.findUnique({ where: { id: slot.meal_id } });
                if (!meal) {
                    errors[`${prefix}.meal_id`] = [
                        this.i18n.translate('restaurant.meal_slots.MEAL_NOT_FOUND', { lang }),
                    ];
                    continue;
                }
                if (!meal.is_active) {
                    errors[`${prefix}.meal_id`] = [
                        this.i18n.translate('restaurant.meal_slots.MEAL_INACTIVE', { lang }),
                    ];
                    continue;
                }

                // Delivery start before end
                if (deliveryStart >= deliveryEnd) {
                    errors[`${prefix}.delivery_end_time`] = [
                        this.i18n.translate('restaurant.meal_slots.DELIVERY_START_BEFORE_END', { lang }),
                    ];
                }

                // Booking must precede delivery
                if (bookingEnd >= deliveryStart) {
                    errors[`${prefix}.delivery_start_time`] = [
                        this.i18n.translate('restaurant.meal_slots.BOOKING_MUST_PRECEDE_DELIVERY', { lang }),
                    ];
                }

                // Kitchen prep gap — minimum 2 hours
                const prepGapMs = deliveryStart.getTime() - bookingEnd.getTime();
                if (prepGapMs < 2 * 60 * 60 * 1000) {
                    errors[`${prefix}.delivery_start_time`] = [
                        ...(errors[`${prefix}.delivery_start_time`] || []),
                        this.i18n.translate('restaurant.meal_slots.KITCHEN_PREP_TIME_INSUFFICIENT', { lang }),
                    ];
                }

                // Duplicate category within the same request
                if (seenCategories.has(meal.category)) {
                    errors[`${prefix}.meal_id`] = [
                        this.i18n.translate('restaurant.meal_slots.DUPLICATE_CATEGORY_SAME_DAY', { lang }),
                    ];
                } else {
                    seenCategories.add(meal.category);
                }
            }

            if (Object.keys(errors).length > 0) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors,
                });
            }

            // ── Create schedule + slots in one transaction ──
            const schedule = await this.prisma.mealDaySchedule.create({
                data: {
                    day_type: createDto.day_type,
                    booking_start_time: new Date(createDto.booking_start_time),
                    booking_end_time: new Date(createDto.booking_end_time),
                    notes: createDto.notes?.trim() || null,
                    slots: {
                        create: createDto.meals.map((slot) => ({
                            meal_id: slot.meal_id,
                            delivery_start_time: new Date(slot.delivery_start_time),
                            delivery_end_time: new Date(slot.delivery_end_time),
                        })),
                    },
                },
                include: { slots: true },
            });

            return this.formatFull(schedule);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_day_schedules.CREATE_FAILED');
        }
    }

    // =============================================================
    // Get All Meal Day Schedules
    // =============================================================
    async findAll(page: number = 1, pageSize: number = 20, withPagination: boolean = true) {
        try {
            if (!withPagination) {
                const items = await this.prisma.mealDaySchedule.findMany({
                    select: {
                        id: true,
                        day_type: true,
                        booking_start_time: true,
                        booking_end_time: true,
                        _count: {
                            select: {
                                slots: true,
                            },
                        },
                    },
                    orderBy: { created_at: 'asc' },
                });
                return {
                    data: items.map((s) => this.formatSummary(s)),
                    meta: {
                        pagination: {
                            page: 1,
                            page_size: items.length,
                            total_pages: 1,
                            total_items: items.length,
                        },
                        search: null,
                        filters: null,
                        sorting: null,
                    },
                };
            }

            const skip = (page - 1) * pageSize;

            const [items, totalItems] = await this.prisma.$transaction([
                this.prisma.mealDaySchedule.findMany({
                    select: {
                        id: true,
                        day_type: true,
                        booking_start_time: true,
                        booking_end_time: true,
                        _count: {
                        select: {
                            slots: true,
                        },
                        },
                    },
                    skip,
                    take: pageSize,
                    orderBy: {
                        created_at: 'asc',
                    },
                }),
                this.prisma.mealDaySchedule.count(),
            ]);

            return {
                data: items.map((s) => this.formatSummary(s)),
                meta: {
                    pagination: {
                        page,
                        page_size: pageSize,
                        total_pages: Math.ceil(totalItems / pageSize),
                        total_items: totalItems,
                    },
                    search: null,
                    filters: null,
                    sorting: null,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_day_schedules.FETCH_FAILED');
        }
    }

    // =============================================================
    // Get One Meal Day Schedule
    // =============================================================
    async findOne(id: number) {
        try {
            const schedule = await this.prisma.mealDaySchedule.findUnique({
                where: { id },
                include: { slots: true },
            });

            if (!schedule) throw new NotFoundException('restaurant.meal_day_schedules.NOT_FOUND');

            return this.formatFull(schedule);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_day_schedules.FETCH_FAILED');
        }
    }

    // =============================================================
    // Update Meal Day Schedule
    // =============================================================
    async update(id: number, updateDto: UpdateMealDayScheduleDto, lang: string) {
        try {
            const existing = await this.prisma.mealDaySchedule.findUnique({
                where: { id },
                include: { slots: true },
            });

            if (!existing) throw new NotFoundException('restaurant.meal_day_schedules.NOT_FOUND');

            // ── Schedule lock — check earliest slot delivery start ──
            const earliestSlot = existing.slots.sort(
                (a, b) => a.delivery_start_time.getTime() - b.delivery_start_time.getTime(),
            )[0];

            if (earliestSlot && new Date() >= earliestSlot.delivery_start_time) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        delivery_start_time: [
                            this.i18n.translate('restaurant.meal_day_schedules.SCHEDULE_LOCKED', { lang }),
                        ],
                    },
                });
            }

            // ── Validate merged booking window ──
            const mergedBookingStart = updateDto.booking_start_time ?? existing.booking_start_time.toISOString();
            const mergedBookingEnd = updateDto.booking_end_time ?? existing.booking_end_time.toISOString();

            this.validateBookingWindow(mergedBookingStart, mergedBookingEnd, lang);

            // ── Re-validate kitchen prep gap against all existing slots ──
            const newBookingEnd = new Date(mergedBookingEnd);
            const prepErrors: string[] = [];

            for (const slot of existing.slots) {
                const prepGapMs = slot.delivery_start_time.getTime() - newBookingEnd.getTime();
                if (prepGapMs < 2 * 60 * 60 * 1000) {
                    prepErrors.push(
                        this.i18n.translate('restaurant.meal_slots.KITCHEN_PREP_TIME_INSUFFICIENT', { lang }),
                    );
                    break; // one error is enough
                }
            }

            if (prepErrors.length > 0) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        booking_end_time: prepErrors,
                    },
                });
            }

            // ── Build update object ──
            const updateData: any = {};
            if (updateDto.day_type !== undefined) updateData.day_type = updateDto.day_type;
            if (updateDto.booking_start_time !== undefined) updateData.booking_start_time = new Date(updateDto.booking_start_time);
            if (updateDto.booking_end_time !== undefined) updateData.booking_end_time = new Date(updateDto.booking_end_time);
            if (updateDto.notes !== undefined) updateData.notes = updateDto.notes?.trim() || null;

            const updated = await this.prisma.mealDaySchedule.update({
                where: { id },
                data: updateData,
                include: { slots: true },
            });

            return this.formatFull(updated);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_day_schedules.UPDATE_FAILED');
        }
    }

    // =============================================================
    // Delete Meal Day Schedule
    // =============================================================
    async remove(id: number, lang: string) {
        try {
            const schedule = await this.prisma.mealDaySchedule.findUnique({
                where: { id },
                include: { slots: true },
            });

            if (!schedule) throw new NotFoundException('restaurant.meal_day_schedules.NOT_FOUND');

            // ── Lock check — earliest slot ──
            const earliestSlot = schedule.slots.sort(
                (a, b) => a.delivery_start_time.getTime() - b.delivery_start_time.getTime(),
            )[0];

            if (earliestSlot && new Date() >= earliestSlot.delivery_start_time) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: ['Validation failed.'],
                    data: null,
                    errors: {
                        delivery_start_time: [
                            this.i18n.translate('restaurant.meal_day_schedules.SCHEDULE_LOCKED', { lang }),
                        ],
                    },
                });
            }

            // Slots cascade-delete automatically from DB
            await this.prisma.mealDaySchedule.delete({ where: { id } });
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('restaurant.meal_day_schedules.DELETE_FAILED');
        }
    }
}