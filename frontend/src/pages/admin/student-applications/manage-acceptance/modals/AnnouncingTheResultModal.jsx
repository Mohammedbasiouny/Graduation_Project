
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { Popup } from '@/components/ui/Popup';
import { useTogglePreliminaryResultAnnounced } from '@/hooks/api/application-dates.hooks';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { showToast } from '@/utils/toast.util';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AnnouncingTheResultModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("announcing-the-result");

  const [ui, setUi] = useState({
    title: "",
    description: "",
    actionYesLabel: "",
    actionNoLabel: "",
    actionVariant: "",
  });

  useEffect(() => {
    if (modalData?.preliminaryResultAnnounced) {
      setUi({
        title: t("manage-acceptance:modals.not_announcing_the_result.title"),
        description: t("manage-acceptance:modals.not_announcing_the_result.description"),
        actionYesLabel: t("manage-acceptance:modals.not_announcing_the_result.buttons.yes"),
        actionNoLabel: t("manage-acceptance:modals.not_announcing_the_result.buttons.no"),
        actionVariant: "danger",
      });
    } else {
      setUi({
        title: t("manage-acceptance:modals.announcing_the_result.title"),
        description: t("manage-acceptance:modals.announcing_the_result.description"),
        actionYesLabel: t("manage-acceptance:modals.announcing_the_result.buttons.yes"),
        actionNoLabel: t("manage-acceptance:modals.announcing_the_result.buttons.no"),
        actionVariant: "success",
      });
    }
  }, [modalData, t]);

  const { 
    mutate: togglePreliminaryResultAnnounced,
    isPending: isLoading,
    isSuccess,
    isError,
  } = useTogglePreliminaryResultAnnounced();

  const handleToggle = () => {
    if (!modalData?.id) return;
    togglePreliminaryResultAnnounced(modalData.id);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
      closeModal("announcing-the-result")
    } if (isError) {
      showToast("error", t("messages:unexpected_error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("announcing-the-result")}
      closeModal={() => closeModal("announcing-the-result")}
      title={ui.title}
      description={ui.description}
    >
      <div className='space-y-5'>
        <div className="flex gap-2">
          <Button
            variant={ui.actionVariant}
            size="md"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleToggle}
          >
            {ui.actionYesLabel}
          </Button>

          <Button
            variant="cancel"
            size="md"
            fullWidth
            onClick={() => closeModal("announcing-the-result")}
            isLoading={isLoading}
            type="button"
          >
            {ui.actionNoLabel}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default AnnouncingTheResultModal;
