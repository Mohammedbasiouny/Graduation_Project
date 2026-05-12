import { useTranslation } from 'react-i18next';
import { FileBadge } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { useGovernorate } from '@/hooks/api/governorates.hooks';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-governorate");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [governorate, setGovernorate] = useState(null);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useGovernorate(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setGovernorate(row);
    setVisibility(getVisibilityStatus(row.is_visible));

  }, [data, t]);

  const columns = useMemo(
    () => [
      t("governorates:table.columns.id"),
      t("governorates:table.columns.name"),
      t("governorates:table.columns.distance_from_cairo"),
      t("governorates:table.columns.is_visible"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view-governorate")} 
      closeModal={() => closeModal("view-governorate")}
      title={t("governorates:modals.view.title")}
      description={t("governorates:modals.view.description")}
    >
      {!governorate || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<FileBadge size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={governorate.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(governorate.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={governorate.distance_from_cairo == 0 ? t("zero") : translateNumber(governorate.distance_from_cairo)} />
              </div>

              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
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
                  closeModal("view-governorate")
                  openModal("edit-governorate", { id: governorate.id })
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
                  closeModal("view-governorate")
                  openModal("delete-governorate", { id: governorate.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-governorate")}
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
