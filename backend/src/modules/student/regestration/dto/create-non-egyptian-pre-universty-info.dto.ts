import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class NonEgyptianPreUniversityInfoDto {
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_inside_egypt: boolean;

    @Type(() => Number)
    @IsNotEmpty()
    certificate_type: number;

    @IsString()
    @IsNotEmpty()
    certificate_country: string;

    @Type(() => Number)
    @IsNotEmpty()
    percentage: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    total_score: number;

    @IsOptional()
    pre_university_certificate?: any;
}
