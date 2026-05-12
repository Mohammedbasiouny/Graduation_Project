import clsx from "clsx";
import { Mars, Venus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";

const BuildingsGenderCountCard = ({
  maleCount = 0,
  femaleCount = 0,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();

  const isMaleClickable = typeof onMaleClick === "function";
  const isFemaleClickable = typeof onFemaleClick === "function";

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
            {t("buildings:overview.buildings_count.title")}
          </p>
          <p className="text-sm text-(--text-muted)">
            {t("buildings:overview.buildings_count.subtitle")}
          </p>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Male */}
        <div
          role={isMaleClickable ? "button" : undefined}
          tabIndex={isMaleClickable ? 0 : undefined}
          className={clsx(
            "rounded-2xl border border-(--gray-lightest) p-4",
            "flex items-center justify-between gap-4 transition",
            "bg-(--blue-lightest)",
            isMaleClickable && "cursor-pointer hover:shadow-sm"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
              <Mars className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-sm text-(--text-muted) truncate">
                {t("buildings:overview.male_buildings_count.label")}
              </p>
              <p className="text-xl font-bold text-(--primary-dark)">
                {maleCount === 0 ? t("zero") : translateNumber(maleCount)}
              </p>
            </div>
          </div>
        </div>

        {/* Female */}
        <div
          role={isFemaleClickable ? "button" : undefined}
          tabIndex={isFemaleClickable ? 0 : undefined}
          className={clsx(
            "rounded-2xl border border-(--gray-lightest) p-4",
            "flex items-center justify-between gap-4 transition",
            "bg-(--red-lightest)",
            isFemaleClickable && "cursor-pointer hover:shadow-sm"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white border border-(--gray-lightest) flex items-center justify-center shrink-0">
              <Venus className="w-6 h-6 text-pink-600" />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-sm text-(--text-muted) truncate">
                {t("buildings:overview.female_buildings_count.label")}
              </p>
              <p className="text-xl font-bold text-(--primary-dark)">
                {femaleCount === 0 ? t("zero") : translateNumber(femaleCount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingsGenderCountCard;
