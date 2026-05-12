import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { translateNumber } from '@/i18n/utils';
import { Button } from '../Button';
import CalendarFooter from './CalendarFooter';
import CalendarWeekDays from './CalendarWeekDays';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import CalendarHeader from './CalendarHeader';
import { DAYS_OF_WEEK, MONTH_NAMES } from '@/constants';
import useBigCalendar from '../../../hooks/use-big-calendar';
import CalendarDay from './CalendarDay';

const BigCalendar = ({ renderDayContent = null }) => {
  const { t } = useTranslation();
  const { setParam, setParams } = useURLSearchParams();

  const {
    year,
    month,
    monthNames,
    daysOfWeek,
    calendarDays,
    goToToday,
    goToNextMonth,
    goToPreviousMonth,
    handleDayClick
  } = useBigCalendar();
  
  useEffect(() => {
    setParams({
      year,
      month: month+1
    })
  }, [year, month]);

  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-zinc-200 overflow-hidden">
      {/* Header */}
      <CalendarHeader 
        goToToday={goToToday}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        month={monthNames[month]}
        year={translateNumber(year)}
      />

      {/* Weekday Headers - Visible only on sm and above */}
      <CalendarWeekDays days={daysOfWeek} />

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 auto-rows-fr min-h-125 sm:min-h-155">
        {calendarDays.map((dayObj, index) => (
          <CalendarDay 
            key={index}
            day={dayObj} 
            onClick={handleDayClick} 
            renderContent={renderDayContent}
          />
        ))}
      </div>

      {/* Footer */}
      <CalendarFooter />
    </div>
  );
};

export default BigCalendar;