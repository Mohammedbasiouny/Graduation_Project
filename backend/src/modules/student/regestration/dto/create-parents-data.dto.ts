import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ParentGuardianDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @Length(14, 14)
    national_id: string;

    @IsString()
    @IsNotEmpty()
    job_title: string;

    @IsString()
    @IsNotEmpty()
    mobile_number: string;

    @IsString()
    @IsNotEmpty()
    nationality: string;

    @IsString()
    @IsNotEmpty()
    relationship: string;

    @IsOptional()
    national_id_front_image?: any;

    @IsOptional()
    national_id_back_image?: any;
}
