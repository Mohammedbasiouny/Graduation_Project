import { Calendar, ArrowRight } from "lucide-react";
import { translateDate, translateTime } from "@/i18n/utils";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { useLanguage } from "@/i18n/use-language.hook";

const TimeCard = ({ label, startTime, endTime }) => {
  const { isArabic } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-900">
      {/* Label */}
      <span className="text-gray-600 truncate">{label}:</span>

      {/* Times */}
      <span className="flex flex-wrap items-center gap-1 sm:gap-2 truncate">
        <span className="truncate">{translateTime(formatToTimeOnly(startTime))}</span>
        <ArrowRight
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${
            isArabic ? "rotate-180" : ""
          }`}
        />
        <span className="truncate">{translateTime(formatToTimeOnly(endTime))}</span>
      </span>
    </div>
  );
};

export default TimeCard;