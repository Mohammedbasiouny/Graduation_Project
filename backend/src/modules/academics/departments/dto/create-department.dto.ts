import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsNotEmpty({ message: 'faculty_id is required' })
    faculty_id: number;

    @IsBoolean()
    @Transform(({ value }) => {
        if (value === true || value === 'true' || value === 1 || value === '1')
        return true;
        if (value === false || value === 'false' || value === 0 || value === '0')
        return false;
        return value;
    })
    @IsNotEmpty({ message: 'is_visible is required' })
    is_visible: boolean;
}