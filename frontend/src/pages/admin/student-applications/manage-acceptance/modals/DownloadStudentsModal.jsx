
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { Popup } from '@/components/ui/Popup';
import { manageAcceptanceService } from '@/services/manage-acceptance.service';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { showToast } from '@/utils/toast.util';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DownloadStudentsModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("download-students");
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false)
  const [needProcessedNationalIds, setNeedProcessedNationalIds] = useState(false)

  const handleDownloadBtnClick = async () => {
    if (!modalData?.id) return;

    setIsLoading(true); // ✅ start loading

    try {
      const response = await manageAcceptanceService.downloadStudents(
        modalData.id,
        { need_processed_national_ids: needProcessedNationalIds },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/zip"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "students-files.zip");

      document.body.appendChild(link);
      link.click();
      link.remove();
      queryClient.invalidateQueries({
        queryKey: ["ai-tasks"],
      });
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const res = error?.response
      if (res?.status === 500) {
        showToast("error", t("messages:unexpected_error"))
      }
    } finally {
      setIsLoading(false); // ✅ stop loading
    }
  };

  return (
    <Popup
      isOpen={isOpen("download-students")}
      closeModal={() => closeModal("download-students")}
      title={t("manage-acceptance:modals.download_students.title")}
      description={t("manage-acceptance:modals.download_students.description")}
    >
      <div className='space-y-5'>
        <div className='space-y-2'>
          <Checkbox 
            label={t("fields:need_processed_national_ids.label")}
            onChange={(e) => setNeedProcessedNationalIds(e.target.checked)}
          />
          <DescriptionText description={t("fields:need_processed_national_ids.description")} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="success"
            size="md"
            fullWidth
            onClick={handleDownloadBtnClick}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t("buttons:isLoading") : t("buttons:download")}
          </Button>

          <Button
            variant="cancel"
            size="md"
            fullWidth
            onClick={() => closeModal("download-students")}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default DownloadStudentsModal;
