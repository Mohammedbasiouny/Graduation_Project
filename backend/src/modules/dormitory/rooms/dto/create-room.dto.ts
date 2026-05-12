import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { RoomType } from '@prisma/client';

const ToBoolean = () => Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
});

const ToNumber = () => Transform(({ value }) => parseInt(value));

export class CreateRoomDto {
    @IsInt()
    @IsNotEmpty({ message: 'building_id is required' })
    @ToNumber()
    building_id: number; 

    @IsString()
    @IsNotEmpty({ message: 'Room name is required' })
    name: string; 

    @IsEnum(RoomType, { message: 'Type must be regular, premium, studying, or medical' })
    type: RoomType;

    @IsInt()
    @Min(1, { message: 'Floor must be at least 1' })
    @ToNumber()
    floor: number; 

    @IsInt()
    @Min(1, { message: 'Capacity must be at least 1 student' })
    @ToNumber()
    capacity: number; 

    @IsOptional()
    @IsString()
    description?: string; 

    @IsBoolean()
    @ToBoolean()
    is_available_for_stay: boolean;
}