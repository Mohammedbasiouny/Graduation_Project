import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
class ExportFiltersDto {
  @IsOptional()
  @IsString()
  gender?: 'male' | 'female';

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEgyptian?: boolean;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_new?: boolean;
}
  
export class ExportStudentsDto {
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  applicationPeriodId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExportFiltersDto)
  filters?: ExportFiltersDto;
}
