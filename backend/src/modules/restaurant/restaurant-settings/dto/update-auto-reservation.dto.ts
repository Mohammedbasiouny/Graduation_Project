import { IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AutoReservationTarget } from '@prisma/client';

const ToBoolean = () => Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
});

export class UpdateAutoReservationDto {
    @IsBoolean()
    @IsNotEmpty()
    @ToBoolean()
    enabled: boolean;

    @IsEnum(AutoReservationTarget, { 
        message: 'restaurant_settings.INVALID_TARGET' 
    })
    @IsNotEmpty()
    target: AutoReservationTarget;
}