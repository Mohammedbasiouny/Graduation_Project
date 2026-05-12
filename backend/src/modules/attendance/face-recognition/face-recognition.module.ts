import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FaceRecognitionService } from './face-recognition.service';
import { FaceRecognitionController } from './face-recognition.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [FaceRecognitionController],
  providers:   [FaceRecognitionService],
  exports:     [FaceRecognitionService],
})
export class FaceRecognitionModule {}