import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DayType } from '@prisma/client';

export class UpdateMealDayScheduleDto {
    @IsOptional()
    @IsEnum(DayType, {
        message: 'Day type must be normal, exam, or ramadan',
    })
    day_type?: DayType;

    @IsOptional()
    @IsDateString({}, { message: 'booking_start_time must be a valid ISO date string' })
    booking_start_time?: string;

    @IsOptional()
    @IsDateString({}, { message: 'booking_end_time must be a valid ISO date string' })
    booking_end_time?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}