import { useTranslation } from 'react-i18next';
import { Check, FileBadge, Hotel } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useBuilding } from '@/hooks/api/buildings.hooks';
import { getAvailableForStayStatus } from '@/utils/available-for-stay-status.utils';

const ViewBuildingModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-building");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [building, setBuilding] = useState(null);
  const [available, setAvailable] = useState(null);

  const { data, isLoading } = useBuilding(modalData?.id);

    useEffect(() => {
      if (!data?.data?.data) return;
      const row = data.data.data;
      setBuilding(row);
      setAvailable(getAvailableForStayStatus(row.is_available_for_stay));
    }, [data, t]);
  

  return (
    <Popup
      isOpen={isOpen("view-building")} 
      closeModal={() => closeModal("view-building")}
      title={t("buildings:modals.view.title")}
      description={t("buildings:modals.view.description")}
    >
      {!building || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<Hotel size={80} className="text-(--primary-dark)" />}
            title={t("buildings:fields.building_name")}
            subtitle={building.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={t("buildings:fields.building_type")} value={t(`buildings:building_type.${building.type}`)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={t("buildings:fields.floors_count")} value={building.floors_count != 0 ? translateNumber(building.floors_count) : t("zero")} />
                <DetailRow label={t("buildings:fields.rooms_count")} value={building.rooms_count != 0 ? translateNumber(building.rooms_count) : t("zero")} />
                <DetailRow label={t("buildings:fields.regular_rooms_count")} value={building.regular_rooms_count != 0 ? translateNumber(building.regular_rooms_count) : t("zero")} />
                <DetailRow label={t("buildings:fields.premium_rooms_count")} value={building.premium_rooms_count != 0 ? translateNumber(building.premium_rooms_count) : t("zero")} />
                <DetailRow label={t("buildings:fields.medical_rooms_count")} value={building.medical_rooms_count != 0 ? translateNumber(building.medical_rooms_count) : t("zero")} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow 
                  label={t("buildings:fields.is_available_for_stay")}
                  value={
                    <StatusBadge variant={available?.variant} size="small" icon={available?.Icon}>
                      {available?.label}
                    </StatusBadge>
                  } 
                />
              </div>
            </div>
          </DetailsCard>

          <div className='flex gap-2'>
            <Button 
              variant="info"
              size="md"
              fullWidth
              onClick={() => {
                  closeModal("view-building")
                  openModal("edit-building", { id: building.id })
                }
              }
            >
              {t("buttons:edit")}
            </Button>
            <Button 
              variant="danger"
              size="md"
              fullWidth
              onClick={() => {
                  closeModal("view-building")
                  openModal("delete-building", { id: building.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-building")}
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default ViewBuildingModal
