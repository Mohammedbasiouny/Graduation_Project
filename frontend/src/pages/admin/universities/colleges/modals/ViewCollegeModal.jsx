import { useTranslation } from 'react-i18next';
import { BookOpenText } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateNumber } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useFaculty } from '@/hooks/api/faculties.hooks';

const ViewCollegeModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-college");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [college, setCollege] = useState(null);
  const [visibility, setVisibility] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useFaculty(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setCollege(row);
    setVisibility(getVisibilityStatus(row.is_visible));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("manage-colleges:columns.id"),
      t("manage-colleges:columns.college_name"),
      t("manage-colleges:columns.university"),
      t("manage-colleges:columns.departments_count"),
      t("manage-colleges:columns.is_visible"),
      t("manage-colleges:columns.college_is_off_campus"),
    ],
    [t]
  );

  const handleCloseModal = () => {
    closeModal("view-college")
  }

  const handleOpenEditModal = () => {
    openModal("edit-college", { id: college.id })
    closeModal("view-college")
  }

  const handleDeleteEditModal = () => {
    openModal("delete-college", { id: college.id })
    handleCloseModal()
  }

  return (
    <Popup
      isOpen={isOpen("view-college")} 
      closeModal={handleCloseModal}
      title={t("manage-colleges:modals.view.title")}
      description={t("manage-colleges:modals.view.description")}
    >
      {!college || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<BookOpenText size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={college.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(college.id)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[2]} value={t(`universities.${college.university}`)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[3]} value={college.departments_count == 0 ? t("zero") : translateNumber(college.departments_count)} />
              </div>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow 
                  label={columns[4]} 
                  value={<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />} 
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DetailRow label={columns[5]} value={college.is_off_campus !== undefined ? t(`fields:college_is_off_campus.options.${college.is_off_campus}`) : t("NA")} />
              </div>
            </div>
          </DetailsCard>

          <div className='flex gap-2'>
            <Button 
              variant="info"
              size="md"
              fullWidth
              onClick={handleOpenEditModal}
            >
              {t("buttons:edit")}
            </Button>
            <Button 
              variant="danger"
              size="md"
              fullWidth
              onClick={handleDeleteEditModal}
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={handleCloseModal}
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default ViewCollegeModal
