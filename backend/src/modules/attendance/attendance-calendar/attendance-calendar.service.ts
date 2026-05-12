import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceCalendarQueryDto } from './dto/attendance-calendar-query.dto';

@Injectable()
export class AttendanceCalendarService {
  constructor(private readonly prisma: PrismaService) {}

  // =============================================================
  // Shared Core Logic
  // =============================================================
  async getMonthlyAttendance(residentId: number, dto: AttendanceCalendarQueryDto) {
    const { year, month } = dto;

    const rangeStart = new Date(year, month - 1, 1);
    const rangeEnd   = new Date(year, month, 0, 23, 59, 59, 999);
    const today      = new Date();

    const logs = await this.prisma.attendanceLog.findMany({
      where: {
        resident_id: residentId,
        logged_at: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      orderBy: { logged_at: 'asc' },
    });

    const logMap = new Map<string, { checkIn: string; method: string }>();
    for (const log of logs) {
      const dateKey = this.formatDateKey(log.logged_at);
      if (!logMap.has(dateKey)) {
        logMap.set(dateKey, {
          checkIn: this.formatTime(log.logged_at),
          method:  log.method === 'face_scan' ? 'face' : 'manual',
        });
      }
    }

    // ── Generate all days of the month ──
    const totalDays = new Date(year, month, 0).getDate();
    const calendar: Record<string, object> = {};

    for (let day = 1; day <= totalDays; day++) {
      const date    = new Date(year, month - 1, day);
      const dateKey = this.formatDateKey(date);

      if (date > today) {
        calendar[dateKey] = { status: 'in_future' };
      } else if (logMap.has(dateKey)) {
        const { checkIn, method } = logMap.get(dateKey)!;
        calendar[dateKey] = { status: 'attend', checkIn, method };
      } else {
        calendar[dateKey] = { status: 'absent' };
      }
    }

    return calendar;
  }

  // =============================================================
  // Student — resolve resident from userId
  // =============================================================
  async getForStudent(userId: number, dto: AttendanceCalendarQueryDto) {
    try {
      const resident = await this.prisma.resident.findFirst({
        where: { student: { userId } },
      });

      if (!resident) {
        throw new NotFoundException('attendance.attendance_calendar.STUDENT_NOT_FOUND');
      }

      return await this.getMonthlyAttendance(resident.id, dto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('attendance.attendance_calendar.FETCH_FAILED');
    }
  }

  // =============================================================
  // Admin — resolve resident from studentId
  // =============================================================
  async getForAdmin(studentId: number, dto: AttendanceCalendarQueryDto) {
    try {
      const resident = await this.prisma.resident.findFirst({
        where: { student_id: studentId },
      });

      if (!resident) {
        throw new NotFoundException('attendance.attendance_calendar.STUDENT_NOT_FOUND');
      }

      return await this.getMonthlyAttendance(resident.id, dto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('attendance.attendance_calendar.FETCH_FAILED');
    }
  }

  // =============================================================
  // Helpers
  // =============================================================
  private formatDateKey(date: Date): string {
    const y  = date.getFullYear();
    const m  = String(date.getMonth() + 1).padStart(2, '0');
    const d  = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
}