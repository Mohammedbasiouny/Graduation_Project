import { useLanguage } from '@/i18n/use-language.hook';
import { translateNumber } from '@/i18n/utils';
import { AlertTriangle, CheckCircle2, ScanFace, Home } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';

const ResidentsKpi = ({ statistics, completion }) => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage()

  const missingFace = statistics.accepted - statistics.face;
  const missingRoom = statistics.accepted - statistics.rooms;

  return (
    <div className="relative w-full">

      {/* Background line */}
      <div className="absolute top-7 left-0 right-0 h-1.5 bg-gray-100 rounded-full" />

      {/* Active progress (RTL/LTR aware) */}
      <div
        className="absolute top-7 h-1.5 bg-black rounded-full transition-all duration-500"
        style={{
          width: `${completion}%`,
          ...(isArabic ? { right: 0 } : { left: 0 }),
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* STEP 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-50 border border-green-100 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <div className='flex gap-4 items-center'>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {t("manage-residents:fast_comparison.accepted")}
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {translateNumber(statistics.accepted)}
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 shadow-sm">
            <ScanFace className="w-6 h-6 text-blue-600" />
          </div>

          <div className='flex gap-4 items-center'>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {t("manage-residents:fast_comparison.face")}
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {translateNumber(statistics.face)}
            </p>
          </div>

          {missingFace > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-500 font-bold justify-center">
              <AlertTriangle className="w-3 h-3" />
              {t("manage-residents:fast_comparison.minus")}{" "}
              {translateNumber(missingFace)}
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-50 border border-purple-100 shadow-sm">
            <Home className="w-6 h-6 text-purple-600" />
          </div>

          <div className='flex gap-4 items-center'>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {t("manage-residents:fast_comparison.rooms")}
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {translateNumber(statistics.rooms)}
            </p>
          </div>

          {missingRoom > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-500 font-bold justify-center">
              <AlertTriangle className="w-3 h-3" />
              {t("manage-residents:fast_comparison.minus")}{" "}
              {translateNumber(missingRoom)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ResidentsKpi