import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOldStudentAcademicInfoDto {
    @IsNotEmpty()
    @Type(() => Number)
    college: number;

    @IsNotEmpty()
    @Type(() => Number)
    department_or_program: number;

    @IsNotEmpty()
    @IsString()
    study_level: string;

    @IsOptional()
    @IsString()
    student_code: string;

    @IsNotEmpty()
    @IsString()
    study_system_type: string;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    gpa_or_total_score: number;

    @IsNotEmpty()
    @IsString()
    grade: string;

    @IsNotEmpty()
    @IsString()
    enrollment_status: string;

    @IsOptional()
    enrollment_proof_image: any;
}
