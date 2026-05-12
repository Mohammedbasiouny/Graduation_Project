import CalendarHeader from '@/components/ui/BigCalendar/CalendarHeader';
import { Button, IconButton } from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Tooltip from '@/components/ui/Tooltip';
import useBigCalendar from '@/hooks/use-big-calendar';
import { translateNumber } from '@/i18n/utils';
import { truncateText } from '@/utils/format-text.utils';
import { Save } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AttendanceCheckInPage = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([
    { floor: "Floor 1", room: "A101", userId: 1, userName: "Mohamed Tarek", attendance: {} },
    { floor: "Floor 1", room: "A101", userId: 2, userName: "Ahmed Tarek", attendance: {} },
    { floor: "Floor 1", room: "A102", userId: 3, userName: "Ali Ahmed", attendance: {} },
    { floor: "Floor 2", room: "B205", userId: 4, userName: "Sara Hassan", attendance: {} },
  ]);

  const { calendarDays, goToNextMonth, goToPreviousMonth, goToToday, year, month, monthNames } = useBigCalendar();

  const monthDays = useMemo(() => {
    return calendarDays.filter(day => day.isCurrentMonth && day.day !== null);
  }, [calendarDays]);

  // Get today's date for comparison
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const isFutureDay = (dayNum) => {
    if (year > currentYear) return true;
    if (year < currentYear) return false;
    if (month > currentMonth) return true;
    if (month < currentMonth) return false;
    
    return dayNum > currentDate;
  };

  const groupedData = useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.floor]) acc[item.floor] = {};
      if (!acc[item.floor][item.room]) acc[item.floor][item.room] = [];
      acc[item.floor][item.room].push(item);
      return acc;
    }, {});
  }, [data]);

  const getFloorUsersCount = (rooms) => {
    return Object.values(rooms).reduce((total, users) => total + users.length, 0);
  };

  const isToday = (dayNum) => {
    return year === currentYear && 
          month === currentMonth && 
          dayNum === currentDate;
  };


  return (
    <div className="w-full flex flex-col gap-6 pt-10 min-h-[60vh]">
      <Heading
        title={t('manage-attendance:heading.title')}
        subtitle={t('manage-attendance:heading.subtitle')}
      />

      <CalendarHeader
        goToToday={goToToday}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        month={monthNames[month]}
        year={translateNumber(year)}
      />

      <div className="w-full overflow-x-auto border bg-white shadow-sm">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="border px-3 py-2 min-w-10.5 w-12.75">
                <div className="writing-mode-vertical rotate-180 text-sm font-semibold text-gray-700 mx-auto">
                  {t("manage-attendance:columns.floor")}
                </div>
              </th>
              <th className="border px-3 py-2 min-w-10.5 w-12.75">
                <div className="writing-mode-vertical rotate-180 text-sm font-semibold text-gray-700 mx-auto">
                  {t("manage-attendance:columns.room")}
                </div>
              </th>
              <th className="border px-3 py-2 min-w-10.5 w-12.75">
                <div className="writing-mode-vertical rotate-180 text-sm font-semibold text-gray-700 mx-auto">
                  {t("manage-attendance:columns.user_id")}
                </div>
              </th>
              <th className="border px-4 py-2 text-sm font-semibold text-gray-700">
                {t("manage-attendance:columns.full_name")}
              </th>

              {monthDays.map((day) => (
                <th
                  key={day.day}
                  className={`border px-1 py-2 min-w-10.5 w-11 text-center ${isToday(day.day) ? 'bg-green-100' : ''}`}
                >
                  <div className="writing-mode-vertical rotate-180 text-sm font-medium text-gray-500 mx-auto mt-1">
                    {day.weekdayName}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mx-auto">
                    {translateNumber(day.day)}
                  </div>
                </th>
              ))}

              <th className="border px-3 py-2 min-w-10.5 w-12.75">
                <div className="writing-mode-vertical rotate-180 text-sm font-semibold text-gray-700 mx-auto">
                  {t("manage-attendance:columns.action")}
                </div>
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Object.entries(groupedData).map(([floor, rooms]) => {
              const floorUsersCount = getFloorUsersCount(rooms);
              let floorRendered = false;

              return Object.entries(rooms).map(([room, users]) =>
                users.map((user, userIndex) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    {/* Floor */}
                    {!floorRendered && userIndex === 0 && (
                      <td
                        rowSpan={floorUsersCount}
                        className="border bg-gray-50 text-center align-middle py-1"
                      >
                        <div className="writing-mode-vertical rotate-180 text-sm font-semibold text-gray-800 mx-auto py-3">
                          {floor}
                        </div>
                      </td>
                    )}

                    {/* Room */}
                    {userIndex === 0 && (
                      <td
                        rowSpan={users.length}
                        className="border bg-gray-50 text-center align-middle py-1"
                      >
                        <div className="writing-mode-vertical rotate-180 text-[15px] font-medium text-gray-700 mx-auto py-3">
                          {room}
                        </div>
                      </td>
                    )}

                    {(() => { floorRendered = true; return null; })()}

                    {/* User ID */}
                    <td className="border px-4 py-3 text-sm text-gray-700 whitespace-nowrap text-center">
                      {translateNumber(user.userId)}
                    </td>

                    {/* User Name */}
                    <td className="border px-4 py-3 text-sm text-gray-700 whitespace-nowrap text-start">
                      {truncateText(user.userName, 40)}
                    </td>

                    {/* Checkboxes for each day */}
                    {monthDays.map((day) => {
                      const isFuture = isFutureDay(day.day);
                      const isCurrentDay = isToday(day.day);
                      
                      return (
                        <td key={day.day} className={`border px-1 py-3 text-center ${isCurrentDay ? 'bg-green-100' : ''}`}>
                          <input
                            type="checkbox"
                            className={`w-4 h-4 cursor-pointer accent-black ${
                              isFuture ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            disabled={isFuture}
                          />
                        </td>
                      );
                    })}

                    {/* Save Button */}
                    <td className="border px-4 py-3">
                      <Tooltip content={t("buttons:save")}>
                        <IconButton
                          icon={Save}
                          className="text-green-600 bg-green-50 rounded-md p-1"
                        />
                      </Tooltip>
                    </td>
                  </tr>
                ))
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceCheckInPage;