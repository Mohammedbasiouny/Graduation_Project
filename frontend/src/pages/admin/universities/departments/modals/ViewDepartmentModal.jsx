import { useTranslation } from 'react-i18next';
import { SquareLibrary } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useDepartment } from '@/hooks/api/departments.hooks';

const ViewDepartmentModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-department");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [department, setDepartment] = useState(null);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useDepartment(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setDepartment(row);
    setVisibility(getVisibilityStatus(row.is_visible));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("manage-departments:columns.id"),
      t("manage-departments:columns.department_name"),
      t("manage-departments:columns.college_name"),
      t("manage-departments:columns.university"),
      t("manage-departments:columns.is_visible"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view-department")} 
      closeModal={() => closeModal("view-department")}
      title={t("manage-departments:modals.view.title")}
      description={t("manage-departments:modals.view.description")}
    >
      {!department || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<SquareLibrary size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={department.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(department.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[3]} value={t(`universities.${department.university}`)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={department.faculty_name} />
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
                  closeModal("view-department")
                  openModal("edit-department", { id: department.id })
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
                  closeModal("view-department")
                  openModal("delete-department", { id: department.id })
                }
              }
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view-department")}
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default ViewDepartmentModal
