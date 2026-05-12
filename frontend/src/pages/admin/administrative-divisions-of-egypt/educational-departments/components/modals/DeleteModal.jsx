import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteEduDepartment } from '@/hooks/api/edu-departments.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';

const DeleteModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-educational-department");
  const { t } = useTranslation();

  const {
    mutate: deleteEduDepartment,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteEduDepartment();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteEduDepartment(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-educational-department");
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

  return (
    <Popup
      isOpen={isOpen("delete-educational-department")} 
      closeModal={() => closeModal("delete-educational-department")}
      title={t("educational-departments:modals.delete.title")} 
      description={t("educational-departments:modals.delete.description")}
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
          {t("buttons:delete")}
        </Button>
        <Button 
          variant="cancel"
          size="md"
          fullWidth
          disabled={isLoading}
          type="button"
          onClick={() => closeModal("delete-educational-department")}
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteModal
