import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendAvtivationAccountDto {
  @IsEmail()
  email: string;
}
