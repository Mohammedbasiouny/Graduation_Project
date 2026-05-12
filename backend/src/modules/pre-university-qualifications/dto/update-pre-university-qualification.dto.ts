import { PartialType } from '@nestjs/swagger';
import { CreatePreUniversityQualificationDto } from './create-pre-university-qualification.dto';

export class UpdatePreUniversityQualificationDto extends PartialType(CreatePreUniversityQualificationDto) { }
