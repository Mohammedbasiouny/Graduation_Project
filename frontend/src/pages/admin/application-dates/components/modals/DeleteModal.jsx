import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteApplicationDate } from '@/hooks/api/application-dates.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { Popup } from '@/components/ui/Popup';

const DeleteModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete");
  const { t } = useTranslation();

  const {
    mutate: deleteApplicationDate,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteApplicationDate();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteApplicationDate(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete");
      showToast("success", t("messages:deleted_successfully"));
    } if (isError) {
      const res = error?.response;
      if (res?.status == 404) {
        showToast("error", t("messages:delete_not_found"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("delete")}
      closeModal={() => closeModal("delete")}
      title={t("application-dates:modals.delete.title")}
      description={t("application-dates:modals.delete.description")}
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
          onClick={() => closeModal("delete")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  );
};

export default DeleteModal;
