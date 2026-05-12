import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AttendanceCalendarService } from '../attendance-calendar.service';
import { AttendanceCalendarQueryDto } from '../dto/attendance-calendar-query.dto';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { I18nLang } from 'nestjs-i18n';
import { ResponseHelper } from 'src/response-helper/response-helper';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/attendance')
export class AdminAttendanceCalendarController {
    constructor(
        private readonly attendanceCalendarService: AttendanceCalendarService,
        private readonly responseHelper: ResponseHelper,
    ) { }

    // =============================================================
    // GET /api/admin/attendance/student/:studentId/calendar
    // =============================================================
    @Get('student/:studentId/calendar')
    @HttpCode(HttpStatus.OK)
    async getStudentAttendance(
        @Param('studentId', ParseIntPipe) studentId: number,
        @Query() query: AttendanceCalendarQueryDto,
        @I18nLang() lang: string,
    ) {
        const data = await this.attendanceCalendarService.getForAdmin(studentId, query);
        return this.responseHelper.success(
            data,
            'attendance.attendance_calendar.RETRIEVED_SUCCESSFULLY',
            lang,
        );
    }
}