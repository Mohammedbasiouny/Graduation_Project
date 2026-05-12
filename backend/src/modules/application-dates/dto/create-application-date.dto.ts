import { 
  IsString, 
  IsDateString, 
  IsIn, 
  IsBoolean, 
  IsOptional 
} from 'class-validator';

export class CreateApplicationDateDto {
  @IsString()
  name: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsIn(['hu', 'hnu', 'hitu', 'all'], {
    message: 'University must be one of: hu, hnu, hitu or all',
  })
  university: string;

  @IsIn(['new', 'old', 'all'], {
    message: 'Student type must be one of: old or new',
  })
  studentType?: string;
}
