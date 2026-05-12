import { Module } from '@nestjs/common';
import { FaceRecognitionModule } from './face-recognition/face-recognition.module';
import { AttendanceCalendarModule } from './attendance-calendar/attendance-calendar.module';

@Module({
  imports: [FaceRecognitionModule, AttendanceCalendarModule]
})
export class AttendanceModule {}
