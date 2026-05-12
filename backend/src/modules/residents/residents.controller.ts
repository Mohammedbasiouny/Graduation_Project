import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { InternalApiKeyGuard } from 'src/modules/auth/guard/internal-api-key.guard';

@UseGuards(InternalApiKeyGuard)
@Controller('api/internal/residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  // =============================================================
  // POST /api/internal/residents/from-enrollment
  // =============================================================
  @Post('from-enrollment')
  @HttpCode(HttpStatus.CREATED)
  async createFromEnrollment(@Body() body: { student_id: number }) {
    return this.residentsService.createFromEnrollment(body.student_id);
  }
}