import BigCalendar from '@/components/ui/BigCalendar';
import Heading from '@/components/ui/Heading';
import { formatToDateOnly } from '@/utils/format-date-and-time.utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
} from 'lucide-react';
import { translateNumber } from '@/i18n/utils';

const BigCalendarStatistics = () => {
  const { t } = useTranslation();

  /**
   * attend_count => students attended
   * total_count => all students count
   */
  const attendanceData = {
    "2026-04-01": {
      attend_count: 320,
      total_count: 400,
    },
    "2026-04-02": {
      attend_count: 280,
      total_count: 400,
    },
    "2026-04-03": {
      attend_count: 390,
      total_count: 400,
    },
    "2026-04-04": {
      attend_count: 150,
      total_count: 400,
    },
    "2026-04-05": {
      attend_count: 0,
      total_count: 400,
    },
    "2026-04-06": {
      status: "in_future",
    },
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) {
      return {
        label: t("manage-attendance:calendar_cell.excellent"),
        className:
          "bg-green-50 text-green-700 border border-green-200",
        dot: "bg-green-600",
      };
    }

    if (percentage >= 60) {
      return {
        label: t("manage-attendance:calendar_cell.good"),
        className:
          "bg-yellow-50 text-yellow-700 border border-yellow-200",
        dot: "bg-yellow-600",
      };
    }

    return {
      label: t("manage-attendance:calendar_cell.low"),
      className:
        "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-600",
    };
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      {/* Calendar Header */}
      <div className='flex flex-col lg:flex-row gap-3 justify-between'>

        <Heading
          align='start'
          size='sm'
          title={t("manage-attendance:calendar_heading.title")}
          subtitle={t("manage-attendance:calendar_heading.subtitle")}
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-3 lg:justify-end">

          <div className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            <span>
              {t("manage-attendance:decrip.high_attendance")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-600" />
            <span>
              {t("manage-attendance:decrip.medium_attendance")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>
              {t("manage-attendance:decrip.low_attendance")}
            </span>
          </div>

        </div>
      </div>

      {/* Calendar */}
      <BigCalendar
        renderDayContent={(day) => {
          const date = formatToDateOnly(day?.date);

          if (!date) return null;

          const attendance = attendanceData?.[date];

          if (!attendance) return null;

          if (attendance?.status === "in_future") {
            return (
              <div className="w-full rounded-xl border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />

                  {t("manage-attendance:calendar_cell.in_future")}
                </div>
              </div>
            );
          }

          const { attend_count, total_count } = attendance;

          const absentCount = total_count - attend_count;

          const percentage = Math.round(
            (attend_count / total_count) * 100
          );

          const status = getAttendanceStatus(percentage);

          return (
            <div className="space-y-3">

              {/* Attendance Status */}
              <div
                className={`
                  w-full rounded-xl px-3 py-2
                  flex items-center gap-2 text-sm font-semibold
                  ${status.className}
                `}
              >
                <span
                  className={`w-2 h-2 rounded-full ${status.dot}`}
                />

                <span>{status.label}</span>
              </div>

              {/* Attend Count */}
              <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-2">

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-zinc-700">
                    <UserCheck className="w-4 h-4 text-green-600" />

                    <span className="text-sm font-medium">
                      {t("manage-attendance:calendar_cell.attended")}
                    </span>
                  </div>

                  <span className="text-base font-black text-zinc-900">
                    {attend_count == 0 ? t("zero") : translateNumber(attend_count)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Users className="w-4 h-4 text-blue-600" />

                    <span className="text-sm font-medium">
                      {t("manage-attendance:calendar_cell.total")}
                    </span>
                  </div>

                  <span className="text-base font-black text-zinc-900">
                    {total_count == 0 ? t("zero") : translateNumber(total_count)}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${percentage}%`
                    }}
                  />
                </div>

              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 gap-2">

                <div className="rounded-lg border border-red-100 bg-red-50 p-2 flex flex-col items-center justify-center">
                  <UserX className="w-4 h-4 text-red-600 mb-1" />

                  <span className="text-xs text-red-700">
                    {t("manage-attendance:calendar_cell.absent")}
                  </span>

                  <span className="text-sm font-bold text-red-800">
                    {absentCount == 0 ? t("zero") : translateNumber(absentCount)}
                  </span>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 flex flex-col items-center justify-center">
                  <Percent className="w-4 h-4 text-blue-600 mb-1" />

                  <span className="text-xs text-blue-700">
                    {t("manage-attendance:calendar_cell.rate")}
                  </span>

                  <span className="text-sm font-bold text-blue-800">
                    {percentage == 0 ? t("zero") : translateNumber(percentage)}%
                  </span>
                </div>

              </div>

            </div>
          );
        }}
      />

    </div>
  );
};

export default BigCalendarStatistics;