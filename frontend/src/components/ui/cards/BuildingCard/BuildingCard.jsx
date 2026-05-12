import { translateNumber } from '@/i18n/utils';
import { Hotel, Mars, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../StatusBadge';
import { useEffect, useState } from 'react';
import { getAvailableForStayStatus } from '@/utils/available-for-stay-status.utils';
import { useLanguage } from '@/i18n/use-language.hook';

const BuildingCard = ({ building, children = null, ...rest }) => {
  const { t } = useTranslation();

  const {
    name,
    type,
    floors_count,
    rooms_count,
    regular_rooms_count,
    premium_rooms_count,
    medical_rooms_count,
    studying_rooms_count,
    is_available_for_stay
  } = building;
  
  const { currentLang } = useLanguage()
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    setAvailable(getAvailableForStayStatus(is_available_for_stay));
  }, [is_available_for_stay, currentLang])

  return (
    <div
      className="w-full rounded-2xl border border-(--gray-light) bg-white shadow-sm p-5 flex flex-col gap-5 hover:shadow-md transition"
      {...rest}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl border border-(--gray-lightest) bg-(--gray-lightest) flex items-center justify-center shrink-0">
            {type === "male" ? (
              <Mars className="w-6 h-6 text-blue-600" />
            ) : (
              <Venus className="w-6 h-6 text-pink-600" />
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <h3 className="text-lg md:text-xl font-semibold text-(--primary-dark) truncate">
              {name}
            </h3>
            <p className="text-sm truncate">
              {t(`buildings:building_type.${type}`)}
            </p>
          </div>
        </div>

        {/* Manage icon */}
        <div
          className="w-10 h-10 rounded-xl border border-(--gray-lightest) hover:bg-(--gray-lightest) flex items-center justify-center transition cursor-pointer shrink-0"
        >
          <Hotel className="w-5 h-5 text-(--primary-dark)" />
        </div>
      </div>

      <div className='flex flex-col xl:flex-row xl:justify-between gap-3'>

        <div className="flex flex-col gap-2">
          <div className="text-base flex items-center gap-2">
            <span className="text-gray-600">
              {t(`buildings:fields.floors_count`)}:
            </span>
            <span className="font-bold text-gray-900">
              {floors_count == 0 ? t("zero") : translateNumber(floors_count)}
            </span>
          </div>
          <div className="text-base flex items-center gap-2">
            <span className="text-gray-600">
              {t(`buildings:fields.rooms_count`)}:
            </span>
            <span className="font-bold text-gray-900">
              {rooms_count == 0 ? t("zero") : translateNumber(rooms_count)}
            </span>
          </div>
        </div>
        <div>
          <StatusBadge variant={available?.variant} size="small" icon={available?.Icon}>
            {available?.label}
          </StatusBadge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 justify-between">
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <p className="text-sm">
            {t("buildings:fields.regular_rooms_count")}
          </p>
          <p className="text-base font-semibold text-(--primary-dark)">
            {regular_rooms_count === 0 ? t("zero") : translateNumber(regular_rooms_count)}
          </p>
        </div>

        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <p className="text-sm">
            {t("buildings:fields.premium_rooms_count")}
          </p>
          <p className="text-base font-semibold text-(--primary-dark)">
            {premium_rooms_count === 0 ? t("zero") : translateNumber(premium_rooms_count)}
          </p>
        </div>

        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <p className="text-sm">
            {t("buildings:fields.medical_rooms_count")}
          </p>
          <p className="text-base font-semibold text-(--primary-dark)">
            {medical_rooms_count === 0 ? t("zero") : translateNumber(medical_rooms_count)}
          </p>
        </div>
        
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <p className="text-sm">
            {t("buildings:fields.studying_rooms_count")}
          </p>
          <p className="text-base font-semibold text-(--primary-dark)">
            {studying_rooms_count === 0 ? t("zero") : translateNumber(studying_rooms_count)}
          </p>
        </div>

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

export default BuildingCard;
