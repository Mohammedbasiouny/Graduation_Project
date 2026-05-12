import clsx from "clsx";
import { BedDouble, Star, ShieldPlus, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";

const RoomsCountCard = ({
  regularCount = 0,
  premiumCount = 0,
  studyingCount = 0,
  medicalCount = 0,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "w-full rounded-2xl border border-(--gray-light) bg-white shadow-md p-5",
        "flex flex-col gap-4",
        className
      )}
      {...rest}
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-(--primary-dark)">
            {t("rooms:overview.rooms_count.title")}
          </p>
          <p className="text-sm">
            {t("rooms:overview.rooms_count.subtitle")}
          </p>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {/* Regular Rooms */}
        <div className="rounded-2xl border border-(--gray-lightest) p-2 flex items-center gap-3 bg-(--gray-lightest)">
          <div className="w-8 h-8 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
            <BedDouble className="w-4 h-4 text-(--primary-dark)" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm truncate">
              {t("rooms:overview.regular_rooms_count.title")}
            </p>
            <p className="text-lg font-bold text-(--primary-dark)">
              {regularCount === 0 ? t("zero") : translateNumber(regularCount)}
            </p>
          </div>
        </div>

        {/* Premium Rooms */}
        <div className="rounded-2xl border border-(--gray-lightest) p-2 flex items-center gap-3 bg-(--blue-lightest)">
          <div className="w-8 h-8 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm truncate">
              {t("rooms:overview.premium_rooms_count.label")}
            </p>
            <p className="text-lg font-bold text-(--primary-dark)">
              {premiumCount === 0 ? t("zero") : translateNumber(premiumCount)}
            </p>
          </div>
        </div>

        {/* Studying Rooms */}
        <div className="rounded-2xl border border-(--gray-lightest) p-2 flex items-center gap-3 bg-(--yellow-lightest)">
          <div className="w-8 h-8 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm truncate">
              {t("rooms:overview.studying_rooms_count.label")}
            </p>
            <p className="text-lg font-bold text-(--primary-dark)">
              {studyingCount === 0 ? t("zero") : translateNumber(studyingCount)}
            </p>
          </div>
        </div>

        {/* Medical Rooms */}
        <div className="rounded-2xl border border-(--gray-lightest) p-2 flex items-center gap-3 bg-(--red-lightest)">
          <div className="w-8 h-8 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
            <ShieldPlus className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm truncate">
              {t("rooms:overview.medical_rooms_count.label")}
            </p>
            <p className="text-lg font-bold text-(--primary-dark)">
              {medicalCount === 0 ? t("zero") : translateNumber(medicalCount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsCountCard;
