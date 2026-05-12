import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AttendanceCalendarService } from '../attendance-calendar.service';
import { AttendanceCalendarQueryDto } from '../dto/attendance-calendar-query.dto';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { GetUser } from 'src/modules/auth/decorator';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';

@Roles('student')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/student/attendance')
export class StudentAttendanceCalendarController {
    constructor(
        private readonly attendanceCalendarService: AttendanceCalendarService,
        private readonly responseHelper: ResponseHelper,
    ) { }

    // =============================================================
    // GET /api/student/attendance/calendar
    // =============================================================
    @Get('calendar')
    @HttpCode(HttpStatus.OK)
    async getMyAttendance(
        @GetUser('sub') userId: number,
        @Query() query: AttendanceCalendarQueryDto,
        @I18nLang() lang: string,
    ) {
        const data = await this.attendanceCalendarService.getForStudent(userId, query);
        return this.responseHelper.success(
            data,
            'attendance.attendance_calendar.RETRIEVED_SUCCESSFULLY',
            lang,
        );
    }
}