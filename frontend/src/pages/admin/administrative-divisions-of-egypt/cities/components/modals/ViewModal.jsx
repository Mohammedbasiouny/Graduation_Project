import { useTranslation } from 'react-i18next';
import { FileBadge } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { useCity } from '@/hooks/api/cities.hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-city");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [city, setCity] = useState(null);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useCity(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setCity(row);
    setVisibility(getVisibilityStatus(row.is_visible));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("cities:table.columns.id"),
      t("cities:table.columns.name"),
      t("cities:table.columns.governorate"),
      t("cities:table.columns.police_station"),
      t("cities:table.columns.is_visible"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view-city")} 
      closeModal={() => closeModal("view-city")}
      title={t("cities:modals.view.title")}
      description={t("cities:modals.view.description")}
    >
      {!city || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<FileBadge size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={city.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(city.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={city.governorate_name} />
                <DetailRow label={columns[3]} value={city.police_station_name} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow 
                  label={columns[4]}
                  value={<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />} 
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
                  closeModal("view-city")
                  openModal("edit-city", { id: city.id })
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
                  closeModal("view-city")
                  openModal("delete-city", { id: city.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-city")}
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default ViewModal
