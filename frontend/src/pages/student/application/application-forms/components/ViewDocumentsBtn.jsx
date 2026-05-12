import { Button } from '@/components/ui/Button'
import { useModalStoreV2 } from '@/store/use.modal.store';
import { File } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next';

const ViewDocumentsBtn = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();


  return (
    <div className='w-fit'>
      <Button 
        icon={<File />} 
        variant='outline'
        type={"button"}
        onClick={() => openModal("view-uploaded-documents")}
      >
        {t("application-steps:buttons.view_documents")}
      </Button>
    </div>
  )
}

export default ViewDocumentsBtn
