import { translateNumber } from "@/i18n/utils";
import { formatToDateOnly } from "@/utils/format-date-and-time.utils";

const CalendarDay = ({ day, onClick, renderContent = null }) => {
  return (
    <div
      onClick={() => onClick(day)}
      className={`
        group relative border border-zinc-200 p-4 sm:p-3 md:p-4
        min-h-30 sm:min-h-32.5
        flex flex-col transition-all duration-200 cursor-pointer hover:bg-zinc-50
        ${day.isCurrentMonth ? 'bg-white' : 'bg-zinc-50 text-zinc-400'}
        ${day.isSelected
          ? 'bg-(--gold-main)/99 ring-2 ring-(--gold-main) ring-inset z-10'
          : ''
        }
      `}
    >
      {/* Day Header - Shows Day Number + Weekday Name on mobile */}
      {day.day && (
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col">
            {/* Day Number */}
            <div
              className={`
                w-9 h-9 flex items-center justify-center rounded-2xl
                text-lg font-medium transition-all
                ${day.isToday
                  ? 'bg-(--gold-main) text-white shadow-md'
                  : day.isSelected
                    ? 'text-(--gold-main) font-semibold'
                    : 'text-zinc-700 group-hover:bg-zinc-100'
                }
              `}
            >
              {translateNumber(day.day)}
            </div>

            {/* Weekday Name - Visible only on small screens */}
            <div className="lg:hidden text-xs font-medium text-zinc-500 mt-1.5">
              {day.weekdayName}
            </div>
          </div>
        </div>
      )}

      {/* Custom Content Slot */}
      {renderContent && (
        <div className="flex-1 mt-1">
          {renderContent?.(day)}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;