import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AcceptanceController } from './acceptance.controller';
import { PipelineService } from './pipeline/pipeline.service';
import { SheetExportService } from './sheet/sheet-export.service';
import { SheetImportService } from './sheet/sheet-import.service';
import { AiTaskService } from './security/security.service';
import { SecurityController } from './security/security.controller';

@Module({
  imports: [
    PrismaModule, 
  ],
  controllers: [
    AcceptanceController, 
    SecurityController
  ],
  providers: [
    PipelineService,
    SheetExportService,
    SheetImportService,
    AiTaskService,
  ],
})
export class AcceptanceModule {}