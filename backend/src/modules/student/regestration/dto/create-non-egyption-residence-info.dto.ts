import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NonEgyptianResidenceInfoDto {
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_inside_egypt: boolean;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  detailed_address: string;

  @IsOptional()
  visa_or_residency_image?: any;
}
