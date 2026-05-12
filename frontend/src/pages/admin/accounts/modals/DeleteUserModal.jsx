import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useDeleteUser } from '@/hooks/api/manage-users.hook';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { useNavigate } from 'react-router';

const DeleteUserModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-user");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    mutate: deleteUser,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteUser();

  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteUser(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-user");
      showToast("success", t("messages:deleted_successfully"));
      navigate("/admin/accounts");
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
      isOpen={isOpen("delete-user")} 
      closeModal={() => closeModal("delete-user")}
      title={t("account:modals.delete.title")} 
      description={t("account:modals.delete.description")}
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
          onClick={() => closeModal("delete-user")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default DeleteUserModal
