import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { useDeleteGovernorate } from '@/hooks/api/governorates.hooks';

const DeleteModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-governorate");
  const { t } = useTranslation();

  const {
    mutate: deleteGovernorate,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteGovernorate();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteGovernorate(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-governorate");
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
      isOpen={isOpen("delete-governorate")} 
      closeModal={() => closeModal("delete-governorate")}
      title={t("governorates:modals.delete.title")} 
      description={t("governorates:modals.delete.description")}
    >
      <div className="flex gap-2">
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
          onClick={() => closeModal("delete-governorate")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteModal
