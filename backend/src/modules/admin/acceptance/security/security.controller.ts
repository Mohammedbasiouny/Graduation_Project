import {
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AiTaskService } from './security.service';
import { UpdateStudentResultDto } from '../dto';

// --- Auth Guards & Decorators ---
import { JwtGuard } from '../../../auth/guard/jwt.guard';
import { Roles, RolesGuard } from '../../../auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/acceptance')
export class SecurityController {
  constructor(private readonly aiTaskService: AiTaskService) {}

  @Get(':studentId/result')
  async getStudentResult(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.aiTaskService.getStudentResult(studentId);
  }

  @Put(':studentId/result')
  async updateStudentResult(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() dto: UpdateStudentResultDto,
  ) {
    return this.aiTaskService.updateStudentResult(studentId, dto);
  }
}