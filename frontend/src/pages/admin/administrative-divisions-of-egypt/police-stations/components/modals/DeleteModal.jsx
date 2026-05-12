import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeletePoliceStation } from '@/hooks/api/police-stations.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';

const DeleteModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-police-station");
  const { t } = useTranslation();

  const {
    mutate: deletePoliceStation,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeletePoliceStation();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deletePoliceStation(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-police-station");
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
      isOpen={isOpen("delete-police-station")} 
      closeModal={() => closeModal("delete-police-station")}
      title={t("police-stations:modals.delete.title")} 
      description={t("police-stations:modals.delete.description")}
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
          onClick={() => closeModal("delete-police-station")}
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
