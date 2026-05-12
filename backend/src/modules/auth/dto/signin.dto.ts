import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
