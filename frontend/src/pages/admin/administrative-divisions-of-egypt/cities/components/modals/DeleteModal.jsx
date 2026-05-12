import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteCity } from '@/hooks/api/cities.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';

const DeleteModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-city");
  const { t } = useTranslation();

  const {
    mutate: deleteCity,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteCity();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteCity(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-city");
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
      isOpen={isOpen("delete-city")} 
      closeModal={() => closeModal("delete-city")}
      title={t("cities:modals.delete.title")} 
      description={t("cities:modals.delete.description")}
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
          onClick={() => closeModal("delete-city")}
          disabled={isLoading}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteModal
