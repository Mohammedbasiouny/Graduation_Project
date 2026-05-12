import BigCalendar from '@/components/ui/BigCalendar';
import Heading from '@/components/ui/Heading';
import { translateTime } from '@/i18n/utils';
import { formatToDateOnly } from '@/utils/format-date-and-time.utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fingerprint, Pencil } from 'lucide-react';
import { useAttendanceCalendarDates } from '@/hooks/api/attendance.hooks';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';

const AttendancePage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();

  const [attendanceData, setAttendanceData] = useState({});

  const { data, isLoading} = useAttendanceCalendarDates(
    null, 
    { year: getParam("year"), month: getParam("month") }, 
    { scope: "student" }
  );

  useEffect(() => {
    if (!data?.data?.data) return;
    
    setAttendanceData(data?.data?.data);
  }, [data]);

  return (
    <div className='w-full flex flex-col gap-5 p-6 min-h-[60vh]'>

      {/* Main Heading */}
      <Heading 
        title={t("manage-attendance:heading.title")}
        subtitle={t("manage-attendance:heading.subtitle")}
      />

      {/* Attendance time notice */}
      <p className="w-full text-lg font-black text-center text-red-800 tracking-wide animate-[pulseScale_1s_ease-in-out_infinite]">
        {t("manage-attendance:start_end", {
          start: translateTime("22:00"),
          end: translateTime("23:00")
        })}
      </p>

      <style>
      {`
        @keyframes pulseScale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.01); opacity: .9; }
        }
      `}
      </style>

      {/* Calendar Header */}
      <div className='flex flex-col lg:flex-row gap-2 justify-between'>
        <Heading 
          align='start'
          size='sm'
          title={t("manage-attendance:calendar_heading.title")}
          subtitle={t("manage-attendance:calendar_heading.subtitle")}
        />

        {/* Legend */}
        <div className="w-full flex flex-wrap lg:items-end lg:justify-end gap-x-5 gap-y-2">

          <div className="flex items-center gap-2 text-base">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>{t("manage-attendance:decrip.blue")}</span>
          </div>

          <div className="flex items-center gap-2 text-base">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>{t("manage-attendance:decrip.green")}</span>
          </div>

          <div className="flex items-center gap-2 text-base">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>{t("manage-attendance:decrip.red")}</span>
          </div>

          {/* NEW legend for method */}
          <div className="flex items-center gap-2 text-base">
            <Fingerprint className="w-4 h-4 text-purple-600" />
            <span>{t("manage-attendance:decrip.face")}</span>
          </div>

          <div className="flex items-center gap-2 text-base">
            <Pencil className="w-4 h-4 text-orange-600" />
            <span>{t("manage-attendance:decrip.manual")}</span>
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

          const { status, checkIn, method } = attendance;

          return (
            <div className="space-y-2">

              {/* Status */}
              <div
                className={`
                  inline-flex items-center gap-2 text-sm font-medium
                  px-2.5 py-1.5 rounded-lg w-full
                  ${status === "attend" ? "bg-green-50 text-green-700 border border-green-200" : ""}
                  ${status === "absent" ? "bg-red-50 text-red-700 border border-red-200" : ""}
                  ${status === "in_future" ? "bg-blue-50 text-blue-700 border border-blue-200" : ""}
                `}
              >
                <span
                  className={`
                    w-1.5 h-1.5 rounded-full
                    ${status === "attend" ? "bg-green-600" : ""}
                    ${status === "absent" ? "bg-red-600" : ""}
                    ${status === "in_future" ? "bg-blue-600" : ""}
                  `}
                />
                {t(`manage-attendance:calendar_cell.${status}`)}
              </div>

              {/* Check-in */}
              {checkIn && (
                <div className="flex items-center gap-1.5 text-sm text-zinc-800">
                  <span className="text-zinc-400">
                    {t("manage-attendance:calendar_cell.check_in_label")}
                  </span>

                  <span className="font-medium text-zinc-900">
                    {translateTime(checkIn)}
                  </span>
                </div>
              )}

              {/* Method (Face / Manual) */}
              {method && (
                <div
                  className={`
                    inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit
                    ${method === "face" ? "bg-purple-50 text-purple-700 border border-purple-200" : ""}
                    ${method === "manual" ? "bg-orange-50 text-orange-700 border border-orange-200" : ""}
                  `}
                >
                  {method === "face" && (
                    <Fingerprint className="w-3.5 h-3.5" />
                  )}

                  {method === "manual" && (
                    <Pencil className="w-3.5 h-3.5" />
                  )}

                  {t(`manage-attendance:calendar_cell.method.${method}`)}
                </div>
              )}

            </div>
          );
        }}
      />

    </div>
  );
};

export default AttendancePage;