import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DownloadPhaseDto {
  @IsNotEmpty()
  @IsBoolean()
  need_processed_national_ids: boolean;
}