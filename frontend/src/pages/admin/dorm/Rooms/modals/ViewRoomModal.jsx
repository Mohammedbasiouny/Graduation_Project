import { useTranslation } from "react-i18next";
import { BedDouble, Building2, Layers3, Users } from "lucide-react";
import { DetailsCard, DetailRow, Popup } from "@/components/ui/Popup";
import { translateNumber } from "@/i18n/utils";
import { Button } from "@/components/ui/Button";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect, useState } from "react";
import NormalSpinner from "@/components/ui/NormalSpinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAvailableForStayStatus } from "@/utils/available-for-stay-status.utils";
import { getRoomType } from "@/utils/room-type.utils";
import { useRoom } from "@/hooks/api/rooms.hooks";

const ViewRoomModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-room");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [room, setRoom] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [available, setAvailable] = useState(null);
  const [buildingAvailable, setBuildingAvailable] = useState(null);

  const { data, isLoading } = useRoom(modalData?.id);

  useEffect(() => {
    if (!data?.data?.data) return;
    
    const row = data.data.data;
    setRoom(row)
    setRoomType(getRoomType(row.type));
    setAvailable(getAvailableForStayStatus(row.is_available_for_stay));
    setBuildingAvailable(getAvailableForStayStatus(row.building_available_for_stay));
  }, [data, t]);

  return (
    <Popup
      isOpen={isOpen("view-room")}
      closeModal={() => closeModal("view-room")}
      title={t("rooms:modals.view.title")}
      description={t("rooms:modals.view.description")}
    >
      {!room || isLoading ? (
        <div className="flex items-center justify-center p-5 bg-gray-100">
          <NormalSpinner />
        </div>
      ) : (
        <div className="space-y-3">
          <DetailsCard
            icon={
              roomType?.Icon ? (
                <roomType.Icon size={80} className="text-(--primary-dark)" />
              ) : (
                <BedDouble size={80} className="text-(--primary-dark)" />
              )
            }
            title={t("rooms:fields.room_name")}
            subtitle={room.name || ""}
            className="space-y-5"
          >
            <div className="space-y-5">
              {/* Room main info */}
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow
                  label={t("rooms:fields.room_type")}
                  value={
                    <StatusBadge
                      variant={roomType?.variant}
                      size="small"
                      icon={roomType?.Icon}
                    >
                      {roomType?.label}
                    </StatusBadge>
                  }
                />

                <DetailRow
                  label={t("rooms:fields.is_available_for_stay")}
                  value={
                    <StatusBadge
                      variant={available?.variant}
                      size="small"
                      icon={available?.Icon}
                    >
                      {available?.label}
                    </StatusBadge>
                  }
                />
              </div>

              {/* Room stats */}
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow
                  label={
                    <div className="flex items-center gap-2">
                      <Layers3 className="w-4 h-4" />
                      <span>{t("rooms:fields.floor")}</span>
                    </div>
                  }
                  value={room.floor === 0 ? t("zero") : translateNumber(room.floor)}
                />

                <DetailRow
                  label={
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{t("rooms:fields.capacity")}</span>
                    </div>
                  }
                  value={
                    room.capacity === 0 ? t("zero") : translateNumber(room.capacity)
                  }
                />

                <DetailRow
                  label={t("rooms:fields.description")}
                  value={!room.description ? t("NA") : room.description}
                />
              </div>

              {/* Building info */}
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow
                  label={
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{t("rooms:fields.building_name")}</span>
                    </div>
                  }
                  value={room.building_name || ""}
                />

                <DetailRow
                  label={t("rooms:fields.building_type")}
                  value={t(`buildings:building_type.${room.building_type}`)}
                />

                <DetailRow
                  label={t("rooms:fields.building_available_for_stay")}
                  value={
                    <StatusBadge
                      variant={buildingAvailable?.variant}
                      size="small"
                      icon={buildingAvailable?.Icon}
                    >
                      {buildingAvailable?.label}
                    </StatusBadge>
                  }
                />
              </div>
            </div>
          </DetailsCard>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="info"
              size="md"
              fullWidth
              onClick={() => {
                closeModal("view-room");
                openModal("edit-room", { id: room.id });
              }}
            >
              {t("buttons:edit")}
            </Button>

            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => {
                closeModal("view-room");
                openModal("delete-room", { id: room.id });
              }}
            >
              {t("buttons:delete")}
            </Button>

            <Button
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-room")}
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ViewRoomModal;
