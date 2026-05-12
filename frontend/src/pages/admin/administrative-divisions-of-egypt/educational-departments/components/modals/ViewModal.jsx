import { useTranslation } from 'react-i18next';
import { FileBadge } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { useEduDepartment } from '@/hooks/api/edu-departments.hooks';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-educational-department");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [eduDepartment, setEduDepartment] = useState(null);
  const [acceptable, setAcceptable] = useState(false);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useEduDepartment(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setEduDepartment(row);
    setAcceptable(getAcceptanceStatus(row.acceptance_status));
    setVisibility(getVisibilityStatus(row.is_visible));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("educational-departments:table.columns.id"),
      t("educational-departments:table.columns.name"),
      t("educational-departments:table.columns.governorate"),
      t("educational-departments:table.columns.is_visible"),
      t("educational-departments:table.columns.acceptance_status"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view-educational-department")} 
      closeModal={() => closeModal("view-educational-department")}
      title={t("educational-departments:modals.view.title")}
      description={t("educational-departments:modals.view.description")}
    >
      {!eduDepartment || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<FileBadge size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={eduDepartment.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(eduDepartment.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={eduDepartment.governorate_name} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow 
                  label={columns[3]} 
                  value={<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />} 
                />
                <DetailRow 
                  label={columns[4]} 
                  value={
                    <StatusBadge variant={acceptable.variant} size="small">
                      {acceptable.label}
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
                  closeModal("view-educational-department")
                  openModal("edit-educational-department", { id: eduDepartment.id })
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
                  closeModal("view-educational-department")
                  openModal("delete-educational-department", { id: eduDepartment.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-educational-department")}
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
