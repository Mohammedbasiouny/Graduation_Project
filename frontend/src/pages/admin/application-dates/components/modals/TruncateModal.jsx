import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useTruncateApplicationDate } from '@/hooks/api/application-dates.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { Popup } from '@/components/ui/Popup';

const TruncateModal = () => {
  const { isOpen, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const {
    mutate: truncateApplicationDate,
    isPending: isLoading,
    isSuccess,
    isError,
  } = useTruncateApplicationDate();

  const handleDelete = () => {
    truncateApplicationDate();
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("truncate");
      showToast("success", t("messages:deleted_successfully"));
    } if (isError) {
      showToast("error", t("messages:unexpected_error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("truncate")}
      closeModal={() => closeModal("truncate")}
      title={t("application-dates:modals.truncate.title")}
      description={t("application-dates:modals.truncate.description")}
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
          onClick={() => closeModal("truncate")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  );
};

export default TruncateModal;
