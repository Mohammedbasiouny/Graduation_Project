import { PartialType } from '@nestjs/swagger';
import { CreateEducationalDepartmentDto } from './create-educational-department.dto';

export class UpdateEducationalDepartmentDto extends PartialType(CreateEducationalDepartmentDto) {}