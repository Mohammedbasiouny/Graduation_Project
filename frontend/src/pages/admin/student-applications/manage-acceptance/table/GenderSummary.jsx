import { Mars, Venus } from "lucide-react";
import { translateNumber } from "@/i18n/utils";
import { useTranslation } from "react-i18next";

const GenderSummary = ({ male = 0, female = 0 }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {/* Male */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100">
        <Mars className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-base">
          {t("manage-acceptance:males")}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {translateNumber(male)}
        </span>
      </div>

      {/* Female */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-100">
        <Venus className="w-3.5 h-3.5 text-pink-600" />
        <span className="text-base">
          {t("manage-acceptance:females")}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {translateNumber(female)}
        </span>
      </div>

    </div>
  );
};

export default GenderSummary;