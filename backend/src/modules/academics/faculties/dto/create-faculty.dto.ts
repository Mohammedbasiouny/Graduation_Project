import { IsString, IsEnum, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export enum UniversityEnum {
    HU = 'hu',
    HNU = 'hnu',
    HITU = 'hitu',
}

const ToBoolean = () => Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return value;
});

export class CreateFacultyDto {
    @IsString()
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsEnum(UniversityEnum, { message: 'university must be one of: hu, hnu, hitu' })
    @IsNotEmpty({ message: 'university is required' })
    university: UniversityEnum;

    @IsBoolean()
    @ToBoolean()
    @IsNotEmpty({ message: 'is_visible is required' })
    is_visible: boolean;

    @IsBoolean()
    @ToBoolean()
    @IsOptional() 
    is_off_campus: boolean;
}