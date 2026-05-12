import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteFaculty } from '@/hooks/api/faculties.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';

const DeleteCollegeModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-college");
  const { t } = useTranslation();

  const {
    mutate: deleteCollege,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteFaculty();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteCollege(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-college");
      showToast("success", t("messages:deleted_successfully"));
    } if (isError) {
      const res = error?.response;
      if (res?.status == 404) {
        showToast("error", t("messages:delete_not_found"));
      }
      if (res?.status == 409) {
        showToast("error", t("messages:delete_related_entities"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const handleCloseModal = () => {
    closeModal("delete-college")
  }

  return (
    <Popup
      isOpen={isOpen("delete-college")} 
      closeModal={handleCloseModal}
      title={t("manage-colleges:modals.delete.title")} 
      description={t("manage-colleges:modals.delete.description")}
    >
      <div className='flex gap-2'>
        <Button
          variant="danger"
          size="md"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleDelete}
        >

          {isLoading ? t("buttons:isLoading") : t("buttons:delete")}
        </Button>
        <Button 
          variant="cancel"
          size="md"
          fullWidth
          disabled={isLoading}
          onClick={handleCloseModal}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteCollegeModal
