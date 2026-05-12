import { Button } from '@/components/ui/Button'
import { useModalStoreV2 } from '@/store/use.modal.store'
import React from 'react'
import { useTranslation } from 'react-i18next'

const AssignFaceIdCard = ({ data }) => {
  const { t } = useTranslation()
  const { openModal } = useModalStoreV2();

  return (
    <section className="h-fit bg-white rounded-2xl shadow-md p-5 space-y-3 transition">
      <div className='flex flex-col gap-3 items-center justify-center'>
        <p className={`text-sm sm:text-base font-bold text-center ${data?.haveFaceId ? "text-green-600" : "text-red-600"}`}>
          {data?.haveFaceId 
            ? t("track-application:found_face_id") 
            : t("track-application:Not_found_face_id")
          }
        </p>
        <Button
          variant='secondary'
          size='xs'
          fullWidth
          onClick={() => openModal("assign-face-id", { id: data?.student_id, haveFaceId: data?.haveFaceId })}
        >
          {data?.haveFaceId 
            ? t("track-application:student_face_id.buttons.change_face_id") 
            : t("track-application:student_face_id.buttons.assign_face_id")
          }
        </Button>
      </div>
    </section>
  )
}

export default AssignFaceIdCard