import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { MealCategory } from '@prisma/client';

const ToBoolean = () => Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
});

export class CreateMealDto {
    @IsString()
    @IsNotEmpty({ message: 'Meal name is required' })
    name: string;

    @IsEnum(MealCategory, { 
        message: 'Category must be breakfast, lunch, dinner, or suhoor' 
    })
    category: MealCategory;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    @ToBoolean()
    is_active?: boolean;
}