import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../Button";
import { useTranslation } from "react-i18next";

const CalendarHeader = ({ goToToday, goToPreviousMonth, goToNextMonth, month, year }) => {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-5 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 flex-wrap">
        <Button size="xs" variant="outline" onClick={goToToday}>
          {t('calendar:today')}
        </Button>

        <div className="flex rtl:flex-row-reverse items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight whitespace-nowrap">
          {month} {year}
        </h1>
      </div>
    </div>
  );
};

export default CalendarHeader;