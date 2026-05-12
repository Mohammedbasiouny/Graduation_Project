import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePreUniversityQualificationDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  is_visible: boolean;


  @IsNumber()
  @Transform(({ value }) => Number(value))
  degree: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
