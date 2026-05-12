import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ParentsInfoDto {
  @IsString()
  @IsNotEmpty()
  parents_status: string;

  @IsBoolean()
  family_residency_abroad: boolean;
}
