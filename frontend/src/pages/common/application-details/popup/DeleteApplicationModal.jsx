import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteProfile } from '@/hooks/api/regestration.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { showServerMessages } from '@/utils/api.utils';

const DeleteApplicationModal = () => {
  const { isOpen, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const {
    mutate: deleteApplication,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteProfile();

  const handleDelete = () => {
    deleteApplication();
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-application");
      showToast("success", t("messages:deleted_successfully"));
    } if (isError) {
      const res = error?.response;
      if (res.status === 400) {
        showServerMessages(res?.data?.message, { type: "error", time: 5000 });
      }
      if (res?.status == 404) {
        showToast("error", t("messages:delete_not_found"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("delete-application")} 
      closeModal={() => closeModal("delete-application")}
      title={t("track-application:modals.delete.title")} 
      description={t("track-application:modals.delete.description")}
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
          onClick={() => closeModal("delete-application")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteApplicationModal
