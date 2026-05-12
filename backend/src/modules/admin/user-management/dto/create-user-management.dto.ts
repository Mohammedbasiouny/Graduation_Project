import { IsEmail, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserManagementDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{14}$/, { message: 'National ID must be 14 digits' })
    national_id: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['admin', 'maintenance', 'cafeteria', 'medical', 'supervisor'], {
        message:
            'role must be one of: admin, maintenance, cafeteria, medical, supervisor',
    })
    role: 'admin' | 'maintenance' | 'cafeteria' | 'medical' | 'supervisor';
}
