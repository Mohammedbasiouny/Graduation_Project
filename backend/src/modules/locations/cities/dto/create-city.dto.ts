import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'governorate_id is required' })
  governorate_id: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'police_station_id is required' })
  police_station_id: number;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  is_visible: boolean;
}