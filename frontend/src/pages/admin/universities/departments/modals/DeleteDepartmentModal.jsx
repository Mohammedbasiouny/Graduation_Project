import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { useDeleteDepartment } from '@/hooks/api/departments.hooks';

const DeleteDepartmentModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-department");
  const { t } = useTranslation();

  const {
    mutate: deleteDepartment,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteDepartment();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteDepartment(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-department");
      showToast("success", t("messages:deleted_successfully"));
    } if (isError) {
      const res = error?.response;
      if (res?.status == 404) {
        showToast("error", t("messages:delete_not_found"));
      } if (res?.status == 409) {
        showToast("error", t("messages:delete_related_entities"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("delete-department")} 
      closeModal={() => closeModal("delete-department")}
      title={t("manage-departments:modals.delete.title")} 
      description={t("manage-departments:modals.delete.description")}
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
          onClick={() => closeModal("delete-department")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteDepartmentModal
