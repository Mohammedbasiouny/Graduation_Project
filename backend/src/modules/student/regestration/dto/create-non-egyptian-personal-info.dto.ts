import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateNonEgyptianPersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  passport_number: string;

  @IsString()
  @IsNotEmpty()
  passport_issuing_country: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  place_of_birth: string;

  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsIn(['male', 'female'])
  gender: string;

  @IsString()
  @IsIn(['muslim', 'christian'])
  religion: string;

  @IsOptional()
  personal_image?: any;

  @IsOptional()
  passport_image?: any;
}
