import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum MentalHealthFrequency {
  ALWAYS = 'always',
  SOMETIMES = 'sometimes',
  RARELY = 'rarely',
  NEVER = 'never',
}

const boolTransform = ({ value }: { value: any }) => {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return value;
};

export class CreateMedicalReportDto {
  // ==================== Boolean fields with conditional details ====================

  @IsBoolean()
  @Transform(boolTransform)
  blood_pressure: boolean;

  @ValidateIf((o) => o.blood_pressure === true)
  @IsNotEmpty({ message: 'blood_pressure_details is required when blood_pressure is true' })
  @IsString()
  blood_pressure_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  diabetes: boolean;

  @ValidateIf((o) => o.diabetes === true)
  @IsNotEmpty({ message: 'diabetes_details is required when diabetes is true' })
  @IsString()
  diabetes_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  heart_disease: boolean;

  @ValidateIf((o) => o.heart_disease === true)
  @IsNotEmpty({ message: 'heart_disease_details is required when heart_disease is true' })
  @IsString()
  heart_disease_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  immune_diseases: boolean;

  @ValidateIf((o) => o.immune_diseases === true)
  @IsNotEmpty({ message: 'immune_diseases_details is required when immune_diseases is true' })
  @IsString()
  immune_diseases_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  mental_health: boolean;

  @ValidateIf((o) => o.mental_health === true)
  @IsNotEmpty({ message: 'mental_health_details is required when mental_health is true' })
  @IsString()
  mental_health_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  other_diseases: boolean;

  @ValidateIf((o) => o.other_diseases === true)
  @IsNotEmpty({ message: 'other_diseases_details is required when other_diseases is true' })
  @IsString()
  other_diseases_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  mental_health_treatment: boolean;

  @ValidateIf((o) => o.mental_health_treatment === true)
  @IsNotEmpty({ message: 'mental_health_treatment_details is required when mental_health_treatment is true' })
  @IsString()
  mental_health_treatment_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  receiving_treatment: boolean;

  @ValidateIf((o) => o.receiving_treatment === true)
  @IsNotEmpty({ message: 'receiving_treatment_details is required when receiving_treatment is true' })
  @IsString()
  receiving_treatment_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  allergies: boolean;

  @ValidateIf((o) => o.allergies === true)
  @IsNotEmpty({ message: 'allergies_details is required when allergies is true' })
  @IsString()
  allergies_details?: string;

  @IsBoolean()
  @Transform(boolTransform)
  special_needs: boolean;

  @ValidateIf((o) => o.special_needs === true)
  @IsNotEmpty({ message: 'special_needs_details is required when special_needs is true' })
  @IsString()
  special_needs_details?: string;

  // ==================== Boolean fields without details ====================

  @IsBoolean()
  @Transform(boolTransform)
  adapt_to_new_environments: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  prefer_solitude: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  behavioral_problems: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  suspension_history: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  shared_room_adaptation: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  social_support: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  stimulants_or_sedatives: boolean;

  @IsBoolean()
  @Transform(boolTransform)
  social_media_usage: boolean;

  // ==================== Mental health scale questions ====================

  @IsNotEmpty({ message: 'sadness_without_reason is required' })
  @IsEnum(MentalHealthFrequency, { message: 'sadness_without_reason must be one of: always, sometimes, rarely, never' })
  sadness_without_reason: MentalHealthFrequency;

  @IsNotEmpty({ message: 'anxiety_or_stress is required' })
  @IsEnum(MentalHealthFrequency, { message: 'anxiety_or_stress must be one of: always, sometimes, rarely, never' })
  anxiety_or_stress: MentalHealthFrequency;

  @IsNotEmpty({ message: 'concentration_difficulty is required' })
  @IsEnum(MentalHealthFrequency, { message: 'concentration_difficulty must be one of: always, sometimes, rarely, never' })
  concentration_difficulty: MentalHealthFrequency;

  @IsNotEmpty({ message: 'sleep_problems is required' })
  @IsEnum(MentalHealthFrequency, { message: 'sleep_problems must be one of: always, sometimes, rarely, never' })
  sleep_problems: MentalHealthFrequency;

  @IsNotEmpty({ message: 'loss_of_interest is required' })
  @IsEnum(MentalHealthFrequency, { message: 'loss_of_interest must be one of: always, sometimes, rarely, never' })
  loss_of_interest: MentalHealthFrequency;

  @IsNotEmpty({ message: 'self_harm_thoughts is required' })
  @IsEnum(MentalHealthFrequency, { message: 'self_harm_thoughts must be one of: always, sometimes, rarely, never' })
  self_harm_thoughts: MentalHealthFrequency;

  @IsNotEmpty({ message: 'appetite_changes is required' })
  @IsEnum(MentalHealthFrequency, { message: 'appetite_changes must be one of: always, sometimes, rarely, never' })
  appetite_changes: MentalHealthFrequency;

  @IsNotEmpty({ message: 'anger_outbursts is required' })
  @IsEnum(MentalHealthFrequency, { message: 'anger_outbursts must be one of: always, sometimes, rarely, never' })
  anger_outbursts: MentalHealthFrequency;
}