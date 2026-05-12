const CalendarWeekDays = ({ days }) => {
  return (
    <div className="hidden lg:grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
      {days.map((day, index) => (
        <div
          key={index}
          className="py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-zinc-500 border-r border-zinc-200 last:border-r-0"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarWeekDays;