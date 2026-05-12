import { getAvailableForStayStatus } from "@/utils/available-for-stay-status.utils";
import { getRoomType } from "@/utils/room-type.utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "../../StatusBadge";
import { BedDouble, Building2, Layers3, Mars, Users, Venus } from "lucide-react";
import { translateNumber } from "@/i18n/utils";
import { useLanguage } from "@/i18n/use-language.hook";

const RoomCard = ({ room, children = null, ...rest }) => {
  const { t } = useTranslation();

  const {
    name,
    type,
    floor,
    capacity,
    is_available_for_stay,
    building_name,
    building_type,
    building_available_for_stay,
  } = room;
  
  const { currentLang } = useLanguage()
  const [roomType, setRoomType] = useState(null);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    setRoomType(getRoomType(type));
  }, [type, currentLang]);

  useEffect(() => {
    setAvailable(getAvailableForStayStatus(is_available_for_stay));
  }, [is_available_for_stay, currentLang]);

  return (
    <div
      className="w-full rounded-2xl border border-(--gray-light) bg-white shadow-sm p-5 flex flex-col gap-5 hover:shadow-md transition"
      {...rest}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Room type icon */}
          <div className="w-12 h-12 rounded-2xl border border-(--gray-lightest) bg-(--gray-lightest) flex items-center justify-center shrink-0">
            {roomType?.Icon && (
              <roomType.Icon className="w-6 h-6 text-(--primary-dark)" />
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col overflow-hidden min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-(--primary-dark) truncate">
              {name}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* Room type badge */}
              <StatusBadge
                variant={roomType?.variant}
                size="small"
                icon={roomType?.Icon}
              >
                {roomType?.label}
              </StatusBadge>

              {/* Room availability */}
              <StatusBadge
                variant={available?.variant}
                size="small"
                icon={available?.Icon}
              >
                {available?.label}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Building info */}
      <div className="rounded-2xl border border-(--gray-lightest) bg-white p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`
              p-2 
              ${building_available_for_stay ? "bg-(--green-lightest) text-(--green-dark)" : "bg-(--red-lightest) text-(--red-dark)"}
            `}>
              <Building2 className="w-5 h-5 shrink-0" />
            </div>
            <p className="text-sm truncate">
              {t("rooms:fields.building_name")}
            </p>
            <span className="text-sm font-semibold text-(--primary-dark) truncate">
              {building_name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {building_type === "male" ? (
              <Mars className="w-6 h-6 text-blue-600" />
            ) : (
              <Venus className="w-6 h-6 text-pink-600" />
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers3 className="w-4 h-4" />
            <p className="text-sm">
              {t("rooms:fields.floor")}
            </p>
          </div>
          <p className="text-base font-semibold text-(--primary-dark)">
            {floor === 0 ? t("zero") : translateNumber(floor)}
          </p>
        </div>

        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <p className="text-sm">
              {t("rooms:fields.capacity")}
            </p>
          </div>
          <p className="text-base font-semibold text-(--primary-dark)">
            {capacity === 0 ? t("zero") : translateNumber(capacity)}
          </p>
        </div>

        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-1 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4" />
            <p className="text-sm">
              {t("rooms:fields.room_type")}
            </p>
          </div>
          <p className="text-base font-semibold text-(--primary-dark) capitalize">
            {roomType?.label}
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

export default RoomCard;
