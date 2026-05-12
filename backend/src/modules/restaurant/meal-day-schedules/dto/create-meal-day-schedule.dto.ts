import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { DayType } from '@prisma/client';
import { CreateMealSlotDto } from './create-meal-slot.dto';

export class CreateMealDayScheduleDto {
    @IsEnum(DayType, {
        message: 'Day type must be normal, exam, or ramadan',
    })
    day_type: DayType;

    @IsDateString({}, { message: 'booking_start_time must be a valid ISO date string' })
    booking_start_time: string;

    @IsDateString({}, { message: 'booking_end_time must be a valid ISO date string' })
    booking_end_time: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one meal slot is required' })
    @ValidateNested({ each: true })
    @Type(() => CreateMealSlotDto)
    meals: CreateMealSlotDto[];

    @IsOptional()
    @IsString()
    notes?: string;
}