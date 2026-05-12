import { useTranslation } from 'react-i18next';
import { FileBadge } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { usePoliceStation } from '@/hooks/api/police-stations.hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-police-station");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [policeStation, setPoliceStation] = useState(null);
  const [acceptable, setAcceptable] = useState(false);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = usePoliceStation(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setPoliceStation(row);
    setVisibility(getVisibilityStatus(row.is_visible));
    setAcceptable(getAcceptanceStatus(row.acceptance_status));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("police-stations:table.columns.id"),
      t("police-stations:table.columns.name"),
      t("police-stations:table.columns.governorate"),
      t("police-stations:table.columns.is_visible"),
      t("police-stations:table.columns.acceptance_status"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view-police-station")} 
      closeModal={() => closeModal("view-police-station")}
      title={t("police-stations:modals.view.title")}
      description={t("police-stations:modals.view.description")}
    >
      {!policeStation || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<FileBadge size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={policeStation.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(policeStation.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={policeStation.governorate_name} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow 
                  label={columns[4]} 
                  value={
                    <StatusBadge variant={acceptable.variant} size="small">
                      {acceptable.label}
                    </StatusBadge>
                  } 
                />
                <DetailRow 
                  label={columns[3]} 
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
                  closeModal("view-police-station")
                  openModal("edit-police-station", { id: policeStation.id })
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
                  closeModal("view-police-station")
                  openModal("delete-police-station", { id: policeStation.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-police-station")}
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
