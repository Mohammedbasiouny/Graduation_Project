import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateMealSlotDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    meal_id: number;

    @IsDateString({}, { message: 'delivery_start_time must be a valid ISO date string' })
    delivery_start_time: string;

    @IsDateString({}, { message: 'delivery_end_time must be a valid ISO date string' })
    delivery_end_time: string;
}