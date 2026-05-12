import { Calendar, ArrowRight } from "lucide-react";
import { translateDate } from "@/i18n/utils";
import { formatToDateOnly } from "@/utils/format-date-and-time.utils";
import { useLanguage } from "@/i18n/use-language.hook";

const DateCard = ({ label, startDate, endDate }) => {
  const { isArabic } = useLanguage();

  return (
    <div className="rounded-2xl border border-(--gray-lightest) bg-white shadow-sm p-4 flex flex-col gap-2 sm:gap-3 hover:shadow-md transition w-full">
      {/* Label */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-(--primary-dark)" />
        <p className="text-sm sm:text-base text-gray-500 font-medium truncate">{label}</p>
      </div>

      {/* Dates */}
      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
        <p className="truncate">{translateDate(formatToDateOnly(startDate))}</p>
        <ArrowRight
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${
            isArabic ? "rotate-180" : ""
          }`}
        />
        <p className="truncate">{translateDate(formatToDateOnly(endDate))}</p>
      </div>
    </div>
  );
};

export default DateCard;