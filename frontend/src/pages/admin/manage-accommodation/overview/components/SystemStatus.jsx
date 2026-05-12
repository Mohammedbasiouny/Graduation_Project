import { translateNumber } from '@/i18n/utils'
import React from 'react'
import { useTranslation } from 'react-i18next';

const SystemStatus = ({ statistics, completion, hasGap }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-5">
      {/* LEFT: SYSTEM STATUS */}
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{t("manage-residents:fast_comparison.system_status")}</p>

        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${
              hasGap ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {t(`manage-residents:fast_comparison.need_review.${hasGap}`)}
          </h1>
        </div>

        <p className="text-sm text-gray-500">
          {translateNumber(completion)}% {t("manage-residents:fast_comparison.percentage")}
        </p>
      </div>

      {/* RIGHT: BIG KPI */}
      <div className="text-right">
        <div className="text-7xl text-center font-extrabold text-gray-900">
          {translateNumber(statistics.rooms)}
        </div>
        <p className="text-sm text-gray-500">
          {t("manage-residents:fast_comparison.accommodated")}
        </p>
      </div>
    </div>
  )
}

export default SystemStatus