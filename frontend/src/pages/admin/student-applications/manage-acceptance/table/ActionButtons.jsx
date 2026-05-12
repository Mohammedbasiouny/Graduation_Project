import { Button } from '@/components/ui/Button'
import { useModalStoreV2 } from '@/store/use.modal.store';
import { Download } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next';

const ActionButtons = ({ isPeriodEnded, data }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const { id, preliminaryResultAnnounced } = data

  return (
    <div className='w-full flex justify-between gao-2 flex-wrap mt-4 pt-3'>
      <Button 
        size="xs" 
        variant='secondary'
        disabled={!isPeriodEnded} 
        icon={<Download />} 
        onClick={() => openModal("download-students", { id })}
      >
        {t("manage-acceptance:buttons.download_students")}
      </Button>
      <div className="flex justify-end gap-2">
        <Button 
          size="xs" 
          variant='info'
          disabled={!isPeriodEnded} 
          onClick={() => openModal("upload-candidates", { id })}
        >
          {t("manage-acceptance:buttons.upload_candidates_for_final_acceptance")}
        </Button>
        <Button 
          size="xs" 
          variant={preliminaryResultAnnounced ? "danger" : "success"}
          disabled={!isPeriodEnded} 
          onClick={() => openModal("announcing-the-result", { id, preliminaryResultAnnounced })}
        >
          {preliminaryResultAnnounced 
              ? t("manage-acceptance:buttons.not_announcing_the_result")
              : t("manage-acceptance:buttons.announcing_the_result")
          }
        </Button>
      </div>
    </div>
  )
}

export default ActionButtons