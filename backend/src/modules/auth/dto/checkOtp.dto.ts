import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CheckOtp {
  @IsNumber()
  @IsNotEmpty()
  otp: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
