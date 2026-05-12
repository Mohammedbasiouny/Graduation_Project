import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getVisibilityStatus } from "@/utils/visibility-status.utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/i18n/use-language.hook";
import { translateNumber } from "@/i18n/utils";

const CollegeCard = ({ college, children = null, ...rest }) => {
  const { t } = useTranslation();
  const {
    university,
    name,
    is_off_campus,
    is_visible,
    departments_count,
  } = college;
  
  const { currentLang } = useLanguage()
  
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    setVisibility(getVisibilityStatus(is_visible));
  }, [is_visible, currentLang])
  
  return (
    <div
      className="
        bg-white rounded-2xl border border-gray-200 shadow-sm
        p-6 flex flex-col gap-5 transition-all 
        hover:shadow-md hover:-translate-y-1 hover:border-gray-300
      "
      {...rest}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1.5">
          {/* University Name */}
          {university && (
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {t(`universities.${university}`)}
            </p>
          )}

          {/* College Name */}
          <h3 className="text-2xl font-bold text-gray-900 leading-snug">
            {name}
          </h3>

          {/* College Location */}
          {is_off_campus !== undefined && (
            <p className="text-sm text-gray-500">
              {t(`fields:college_is_off_campus.options.${is_off_campus}`)}
            </p>
          )}

        </div>

        {/* Visibility Status */}
        <StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon}>
          {visibility.label}
        </StatusBadge>
      </div>

      <div className="text-base flex items-center gap-2">
        <span className="text-gray-600">
          {t(`manage-colleges:cards.college_details.departments_count`)}:
        </span>
        <span className="font-bold text-gray-900">
          {departments_count == 0 ? t("zero") : translateNumber(departments_count)}
        </span>
      </div>

      {children && (
        <>
          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Actions */}
          {children}
        </>
      )}
    </div>
  );
};

export default CollegeCard;
