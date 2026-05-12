import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { translateDate, translateTime } from '@/i18n/utils';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { useToggleUserBlock } from '@/hooks/api/manage-users.hook';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';

const BlockUserModal = ({ refetch }) => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("block-user");
  const { t } = useTranslation();

  const {
    mutate: toggleUserBlock,
    isPending: isLoading,
    isSuccess,
    isError,
    error
  } = useToggleUserBlock();

  const handleDelete = () => {
    if (!modalData?.id) return;
    toggleUserBlock(modalData.id);
  };

  // Close modal automatically when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal("block-user");
      showToast("success", t("account:messages.toggle_block_user_successfully"));
      refetch();
    } if (isError) {
      const res = error?.response;
      if (res?.status == 404) {
        showToast("error", t("account:messages.toggle_block_user_not_found"));
      } else {
        showToast("error", t("account:messages.toggle_block_user_failed"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("block-user")} 
      closeModal={() => closeModal("block-user")}
      title={t(`account:modals.${modalData?.status ? "block" : "unblock"}.title`)} 
      description={t(`account:modals.${modalData?.status ? "block" : "unblock"}.description`, { blockDate: translateDate(formatToDateOnly(new Date().toISOString())), blockTime: translateTime(formatToTimeOnly(new Date().toISOString())) })}
    >
      <div className='flex gap-2'>
        <Button 
          variant={modalData?.status ? "black" : "info"}
          size="md"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleDelete}
        >
          {isLoading ? t("buttons:isLoading") : t(`buttons:${modalData?.status ? "block" : "unblock"}`)}
        </Button>
        <Button 
          variant="cancel"
          size="md"
          fullWidth
          disabled={isLoading}
          onClick={() => closeModal("block-user")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  )
}

export default BlockUserModal
