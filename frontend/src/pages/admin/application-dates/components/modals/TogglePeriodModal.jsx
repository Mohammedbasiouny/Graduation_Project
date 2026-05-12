import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useState } from 'react';
import { useTogglePeriodStatus } from '@/hooks/api/application-dates.hooks';
import { showToast } from '@/utils/toast.util';

const TogglePeriodModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("toggle-period");

  const [ui, setUi] = useState({
    title: "",
    description: "",
    actionLabel: "",
    actionVariant: "primary",
  });

  useEffect(() => {
    if (modalData?.periodStatus) {
      setUi({
        title: t("application-dates:modals.end_period.title"),
        description: t("application-dates:modals.end_period.description"),
        actionLabel: t("buttons:stop"),
        actionVariant: "danger",
      });
    } else {
      setUi({
        title: t("application-dates:modals.start_period.title"),
        description: t("application-dates:modals.start_period.description"),
        actionLabel: t("buttons:start"),
        actionVariant: "primary",
      });
    }
  }, [modalData, t]);

  const { 
    mutate: togglePeriodStatus,
    isPending: isLoading,
    isSuccess,
    isError,
  } = useTogglePeriodStatus();

  const handleTruncate = () => {
    togglePeriodStatus();
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
      closeModal("toggle-period")
    } if (isError) {
      showToast("error", t("messages:unexpected_error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("toggle-period")} 
      closeModal={() => closeModal("toggle-period")}
      title={ui.title}
      description={ui.description}
    >
      <div className='flex gap-2'>
        <Button 
          variant={ui.actionVariant}
          size="md"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleTruncate}
        >
          {isLoading ? t("buttons:isLoading") : ui.actionLabel}
        </Button>

        <Button 
          variant="cancel"
          size="md"
          fullWidth
          disabled={isLoading}
          onClick={() => closeModal("toggle-period")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default TogglePeriodModal
