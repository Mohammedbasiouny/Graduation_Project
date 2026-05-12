import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNewStudentAcademicInfoDto {
    @IsNotEmpty()
    @Type(() => Number)
    college: number;

    @IsNotEmpty()
    @Type(() => Number)
    department_or_program: number;

    @IsNotEmpty()
    @IsString()
    admission_year: string;

    @IsOptional()
    nomination_card_image : any;

}