import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Res,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { I18nService, I18nContext, I18nLang } from 'nestjs-i18n';

import { PipelineService } from './pipeline/pipeline.service';
import { SheetExportService } from './sheet/sheet-export.service';
import { SheetImportService } from './sheet/sheet-import.service';
import { DownloadPhaseDto } from './dto/download-phase.dto';

// --- Auth Guards & Decorators ---
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { Roles, RolesGuard } from '../../auth/roles';
import { GetUser } from 'src/modules/auth/decorator';
import { AiTaskService } from './security/security.service';

@Roles('admin', 'supervisor') // Expanded roles to avoid locking out legitimate staff
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/acceptance')
export class AcceptanceController {
  constructor(
    private readonly pipelineService: PipelineService,
    private readonly sheetExportService: SheetExportService,
    private readonly sheetImportService: SheetImportService,
    private readonly i18n: I18nService,
    private readonly aiTaskService: AiTaskService
  ) {}

  @Post('phase/:id/download')
  async exportPhaseSheets(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DownloadPhaseDto,
    @GetUser('sub') adminUserId: number,
    @Res() res: Response,
  ): Promise<void> {
    const lang = I18nContext.current()?.lang;

    // 1. Check if the pipeline has run for this phase
    const pipelineRan = await this.pipelineService.hasPipelineRun(id);
    
    // 2. If it hasn't run, execute it automatically before exporting
    if (!pipelineRan) {
      await this.pipelineService.runPipeline(id);
    }

    // 3. Proceed with exporting the now-processed data
    const result = await this.sheetExportService.exportPhaseSheetsToBuffer(id, adminUserId, dto);
    
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('acceptance.export.no_data', { lang, args: { phaseId: id } }) as string,
      );
    }

    const encodedFileName = encodeURIComponent(result.fileName);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`,
      'Content-Length': result.buffer.length,
    });

    res.end(result.buffer);
  }

  @Post('phase/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async importStudentMessages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sheetImportService.importStudentMessages(file, id);
  }

  @Get('get-ai-tasks')
  findStudentApplicationDates(@I18nLang() lang: string, @GetUser('sub') id: number) {
    return this.aiTaskService.findAiTasks(lang, id);
  }
}