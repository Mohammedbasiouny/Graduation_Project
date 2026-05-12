import {
  IsString,
  IsNotEmpty,
  Matches,
  IsIn,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';

export class CreateEgyptianPersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'National ID must be 14 digits' })
  national_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['muslim', 'christian'], {
    message: 'Religion must be muslim or christian',
  })
  religion: string;

  @IsString()
  @IsNotEmpty()
  birth_country: string;

  @IsString()
  @IsNotEmpty()
  birth_city: string;

  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsOptional()
  landline_number: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsOptional()
  personal_image?: any;

  @IsOptional()
  national_id_front_image?: any;

  @IsOptional()
  national_id_back_image?: any;
}
