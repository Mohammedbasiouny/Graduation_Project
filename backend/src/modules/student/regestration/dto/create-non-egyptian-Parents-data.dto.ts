import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NonEgyptianRelativeDto {
  @IsString()
  @IsNotEmpty()
  identity_number: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  job_title: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;

  @IsString()
  mobile_number: string;

  @IsOptional()
  identity_image?: any;
}
