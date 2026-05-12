import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangePassDto {

    @IsString()
    @IsNotEmpty()
    old_password: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%&*^()])/, {
        message:
            'Password must contain at least one uppercase letter and one symbol (!@#$%&*^())',
    })
    new_password: string;
}