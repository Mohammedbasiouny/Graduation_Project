import { useState, useMemo, useEffect } from "react";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { DAYS_OF_WEEK, MONTH_NAMES } from "@/constants";

const useBigCalendar = () => {
  const { setParam } = useURLSearchParams();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month]
  );

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );

  const daysOfWeek = DAYS_OF_WEEK();
  const monthNames = MONTH_NAMES();

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      const isToday = date.getTime() === today.getTime();

      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const weekdayIndex = date.getDay();
      const weekdayName = daysOfWeek[weekdayIndex];

      days.push({
        day,
        date,
        isToday,
        isSelected,
        isCurrentMonth: true,
        weekdayName,
      });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;

    while (days.length < totalCells) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  }, [year, month, firstDayOfMonth, daysInMonth, selectedDate, daysOfWeek]);

  const handleDayClick = (dayObj) => {
    if (dayObj?.date) {
      setSelectedDate(dayObj.date);
    }
  };

  return {
    year,
    month,
    monthNames,
    daysOfWeek,
    calendarDays,
    selectedDate,
    goToToday,
    goToNextMonth,
    goToPreviousMonth,
    handleDayClick,
  };
};

export default useBigCalendar;