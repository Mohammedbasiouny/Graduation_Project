import { ArrowRight, Calendar, Clock, Utensils, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "../../StatusBadge";
import { translateDate, translateNumber, translateTime } from "@/i18n/utils";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { useLanguage } from "@/i18n/use-language.hook";
import DateCard from "./DateCard";
import TimeCard from "./TimeCard";

const TodayMealCard = ({ meal, children = null, ...rest }) => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  // If no meal, show "No meal today"
  if (!meal) {
    return (
      <div
        className="w-full h-64 md:h-48 rounded-2xl border border-gray-200 bg-white shadow-md flex items-center justify-center text-gray-400 font-semibold text-lg p-4"
        {...rest}
      >
        {t("restaurant:cards.today_meal.no_meal")}
      </div>
    );
  }

  const {
    meal_name,
    meal_description,
    meal_category,
    day_type,
    delivery_start_time,
    delivery_end_time,
    booking_start_time,
    booking_end_time,
    notes,
    students_booked
  } = meal;

  return (
    <div
      className="w-full rounded-2xl border border-gray-200 bg-white shadow-md p-4 md:p-6 flex flex-col gap-4 md:gap-6 hover:shadow-lg transition"
      {...rest}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-primary-dark" />
          </div>

          {/* Title + Category + Description */}
          <div className="flex flex-col overflow-hidden gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark truncate">
                {meal_name}
              </h3>
              {day_type && (
                <StatusBadge variant={"info"} size="small">
                  {t(`fields:day_type.options.${day_type}`)}
                </StatusBadge>
              )}
            </div>

            {meal_category && (
              <p className="text-sm sm:text-base text-gray-500 truncate">
                {t(`fields:meal_category.options.${meal_category}`)}
              </p>
            )}

            {meal_description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                {meal_description}
              </p>
            )}
          </div>
        </div>

        {/* Today badge */}
        <div className="mt-2 sm:mt-0">
          <StatusBadge variant="success" size="small" icon={Clock}>
            {t("restaurant:cards.today_meal.title")}
          </StatusBadge>
        </div>
      </div>

      {/* Delivery + Booking summary */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
        <TimeCard
          label={t("restaurant:cards.today_meal.delivery_time")}
          startTime={delivery_start_time}
          endTime={delivery_end_time}
        />

        <TimeCard
          label={t("restaurant:cards.today_meal.booking_time")}
          startTime={booking_start_time}
          endTime={booking_end_time}
        />
      </div>

      {/* Stats / Date Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <DateCard
          label={t("restaurant:cards.today_meal.delivery_period")}
          startDate={delivery_start_time}
          endDate={delivery_end_time}
        />

        <DateCard
          label={t("restaurant:cards.today_meal.booking_period")}
          startDate={booking_start_time}
          endDate={booking_end_time}
        />

        {/* Students Booked */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 flex flex-col gap-1 hover:shadow-md transition">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-dark" />
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              {t("restaurant:cards.today_meal.students_booked")}
            </p>
          </div>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            {students_booked !== 0 ? translateNumber(students_booked) : t("zero")}
          </p>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-2">
          {notes}
        </div>
      )}

      {/* Children / Actions */}
      {children ? (
        <>
          <div className="border-t border-gray-200 mt-2"></div>
          {children}
        </>
      ) : null}
    </div>
  );
};

export default TodayMealCard;