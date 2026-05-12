import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getVisibilityStatus } from "@/utils/visibility-status.utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/i18n/use-language.hook";

const DepartmentCard = ({
  department,
  children = null,
}) => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(false);
  const { currentLang } = useLanguage()

  const {
    university,
    name,
    faculty_name,
    is_visible,
  } = department;

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
    >
      {/* Top Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1.5">
          {/* University Name */}
          {university && (
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              
            </p>
          )}

          {/* College Name */}
          <h3 className="text-base font-bold text-gray-700 leading-snug">
            {university && (t(`universities.${university}`))} - {faculty_name}
          </h3>

          {/* College Name */}
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            {name}
          </h2>
          

          {/* Visibility Status */}
          <StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon}>
            {visibility.label}
          </StatusBadge>
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
    </div>
  );
};

export default DepartmentCard;
