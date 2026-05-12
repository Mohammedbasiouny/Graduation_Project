import {
  Controller,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/attendance/face-recognition')
export class FaceRecognitionController {
  constructor(
    private readonly faceRecognitionService: FaceRecognitionService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // =============================================================
  // POST /api/admin/attendance/face-recognition/hydrate
  // =============================================================
  @Post('hydrate')
  @HttpCode(HttpStatus.OK)
  async hydrate(@I18nLang() lang: string) {
    const data = await this.faceRecognitionService.hydrateMemory();
    return this.responseHelper.success(
      data,
      'attendance.face_recognition.HYDRATED_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // POST /api/admin/attendance/face-recognition/reset
  // =============================================================
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async reset(@I18nLang() lang: string) {
    const data = await this.faceRecognitionService.resetSystem();
    return this.responseHelper.success(
      data,
      'attendance.face_recognition.RESET_SUCCESSFULLY',
      lang,
    );
  }

  // =============================================================
  // DELETE /api/admin/attendance/face-recognition/unenroll/:studentId
  // =============================================================
  @Delete('unenroll/:studentId')
  @HttpCode(HttpStatus.OK)
  async unenroll(
    @Param('studentId', ParseIntPipe) studentId: number,
    @I18nLang() lang: string,
  ) {
    const data = await this.faceRecognitionService.unenrollStudent(studentId);
    return this.responseHelper.success(
      data,
      'attendance.face_recognition.UNENROLLED_SUCCESSFULLY',
      lang,
    );
  }
}