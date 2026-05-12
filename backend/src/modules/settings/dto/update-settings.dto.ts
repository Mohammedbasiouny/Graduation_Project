import {
  IsBoolean,
  IsDefined,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsDefined()
  @IsBoolean()
  restaurant_status: boolean;

  @IsDefined()
  @IsBoolean()
  application_period_open: boolean;

  @IsDefined()
  @IsBoolean()
  auto_meal_reserve: boolean;

  @IsDefined()
  @IsBoolean()
  admission_results_announced: boolean;

  @IsDefined()
  @IsBoolean()
  university_housing_started: boolean;

  @IsDefined()
  @IsBoolean()
  female_visits_available: boolean;

  @IsDefined()
  @IsBoolean()
  online_payment_available: boolean;

  @IsDefined()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'attendance_start must be in format HH:mm:ss',
  })
  attendance_start: string;

  @IsDefined()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'attendance_end must be in format HH:mm:ss',
  })
  attendance_end: string;
}
