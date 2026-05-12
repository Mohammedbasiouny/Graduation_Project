import { useTranslation } from 'react-i18next';
import { FileBadge } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import { usePerUniQualification } from '@/hooks/api/pre-uni-qualifications.hooks';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [perUniQualification, setPerUniQualification] = useState(null);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = usePerUniQualification(modalData?.id);
  

  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setPerUniQualification(row);
    setVisibility(getVisibilityStatus(row.is_visible));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("educational-certificates:table.columns.id"),
      t("educational-certificates:table.columns.name"),
      t("educational-certificates:table.columns.is_visible"),
      t("educational-certificates:table.columns.degree"),
      t("educational-certificates:table.columns.notes"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view")} 
      closeModal={() => closeModal("view")}
      title={t("educational-certificates:modals.view.title")}
      description={t("educational-certificates:modals.view.description")}
    >
      {!perUniQualification || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<FileBadge size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={perUniQualification.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(perUniQualification.id)} />
                <DetailRow 
                  label={columns[2]} 
                  value={<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />} 
                />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[3]} value={translateNumber(perUniQualification.degree)} />
                <DetailRow label={columns[4]} value={perUniQualification.notes ? perUniQualification.notes : t("NA")} />
              </div>
            </div>
          </DetailsCard>

          <div className='flex gap-2'>
            <Button 
              variant="info"
              size="md"
              fullWidth
              onClick={() => {
                  closeModal("view")
                  openModal("edit", { id: perUniQualification.id })
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
                  closeModal("view")
                  openModal("delete", { id: perUniQualification.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view")}
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
