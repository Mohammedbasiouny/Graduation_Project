import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect } from "react";
import { Popup } from "@/components/ui/Popup";
import { useDeleteMeal } from "@/hooks/api/meals.hooks";
import { showToast } from "@/utils/toast.util";

const DeleteModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("delete-meal"); // unique modal key for meals


  const {
    mutate: deleteMeal,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useDeleteMeal();


  const handleDelete = () => {
    if (!modalData?.id) return;
    deleteMeal(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("delete-meal");
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
    closeModal("delete-meal")
  }

  return (
    <Popup
      isOpen={isOpen("delete-meal")}
      closeModal={() => closeModal("delete-meal")}
      title={t("meals:modals.delete.title")}
      description={t("meals:modals.delete.description")}
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
          onClick={handleCloseModal}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  );
};

export default DeleteModal;