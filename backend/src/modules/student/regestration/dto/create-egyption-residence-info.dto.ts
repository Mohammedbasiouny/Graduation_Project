import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class EgyptianResidenceInfoDto {
  @IsBoolean()
  is_inside_egypt: boolean;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @Type(() => Number)
  governorate: number;

  @IsNotEmpty()
  @Type(() => Number)
  district_or_center: number;

  @IsNotEmpty()
  @Type(() => Number)
  city_or_village: number;

  @IsNotEmpty()
  detailed_address: string;
}
