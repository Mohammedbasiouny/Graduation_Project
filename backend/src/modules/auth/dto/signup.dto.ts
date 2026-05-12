import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%&*^()])/, {
    message:
      'Password must contain at least one uppercase letter and one symbol (!@#$%&*^())',
  })
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['hu', 'hnu', 'hitu'], {
    message: 'University must be one of: hu, hnu, hiut',
  })
  university: string;
}
