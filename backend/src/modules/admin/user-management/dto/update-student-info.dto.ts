import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentInfoDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['hu', 'hnu', 'hitu'], {
        message: 'university must be one of: hu, hnu, hitu',
    })
    university: 'hu' | 'hnu' | 'hitu';
}
