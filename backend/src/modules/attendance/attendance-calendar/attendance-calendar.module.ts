import { Module } from '@nestjs/common';
import { AttendanceCalendarService } from './attendance-calendar.service';
import { StudentAttendanceCalendarController } from './controllers/student-attendance-calendar.controller';
import { AdminAttendanceCalendarController } from './controllers/admin-attendance-calendar.controller';

@Module({
  controllers: [AdminAttendanceCalendarController, StudentAttendanceCalendarController],
  providers: [AttendanceCalendarService],
})
export class AttendanceCalendarModule {}
