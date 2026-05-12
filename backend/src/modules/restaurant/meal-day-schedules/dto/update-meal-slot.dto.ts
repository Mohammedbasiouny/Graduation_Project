import { IsDateString, IsOptional } from 'class-validator';

export class UpdateMealSlotDto {
    @IsOptional()
    @IsDateString({}, { message: 'delivery_start_time must be a valid ISO date string' })
    delivery_start_time?: string;

    @IsOptional()
    @IsDateString({}, { message: 'delivery_end_time must be a valid ISO date string' })
    delivery_end_time?: string;
}