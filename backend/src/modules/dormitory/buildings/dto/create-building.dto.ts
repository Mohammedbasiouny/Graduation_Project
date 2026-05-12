import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@prisma/client';

const ToBoolean = () => Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
});

export class CreateBuildingDto {
    @IsString()
    @IsNotEmpty({ message: 'Building name is required' })
    name: string; 

    @IsEnum(Gender, { message: 'Type must be male or female' })
    type: Gender; 

    @IsInt()
    @Min(1, { message: 'Building must have at least 1 floor' })
    @Transform(({ value }) => parseInt(value)) 
    floors_count: number; 

    @IsBoolean()
    @ToBoolean()
    is_available_for_stay: boolean; 
}