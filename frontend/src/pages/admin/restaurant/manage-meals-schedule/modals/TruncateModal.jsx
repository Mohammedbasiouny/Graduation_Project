import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { Popup } from '@/components/ui/Popup';

const TruncateModal = () => {
  const { isOpen, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  return (
    <Popup
      isOpen={isOpen("truncate")}
      closeModal={() => closeModal("truncate")}
      title={t("meals-schedule:modals.truncate.title")}
      description={t("meals-schedule:modals.truncate.description")}
    >
      <div className="flex gap-2">
        <Button
          variant="danger"
          size="md"
          fullWidth
        >

          {t("buttons:delete")}
        </Button>

        <Button
          variant="cancel"
          size="md"
          fullWidth
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
