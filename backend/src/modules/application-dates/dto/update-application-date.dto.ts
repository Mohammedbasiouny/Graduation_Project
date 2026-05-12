import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDateDto } from './create-application-date.dto';

export class UpdateApplicationDateDto extends PartialType(
  CreateApplicationDateDto,
) {}
