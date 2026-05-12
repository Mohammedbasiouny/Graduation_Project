import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceCalendarQueryDto {
    @Type(() => Number)
    @IsInt()
    @Min(2026)
    year: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    month: number;
}