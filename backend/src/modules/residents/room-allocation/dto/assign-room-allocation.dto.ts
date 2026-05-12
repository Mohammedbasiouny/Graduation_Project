import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateRoomAllocationDto {
  @IsInt()
  student_id: number;

  @IsInt()
  building_id: number;

  @IsInt()
  room_id: number;

  @IsString()
  @IsOptional()
  notes?: string;
}