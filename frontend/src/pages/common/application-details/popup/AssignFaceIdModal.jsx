import { Button } from '@/components/ui/Button';
import { Camera, CameraAxisGuide, CameraControllers, CameraOverlay, CameraTimer, EnrollmentProgressBox } from '@/components/ui/Camera';
import { Popup } from '@/components/ui/Popup'
import useCamera from '@/hooks/use-camera.hook';
import { regestrationKeys } from '@/keys/resources/regestration.keys';
import useEnrollSocket from '@/pages/admin/student-applications/track-application/hook';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

const AssignFaceIdModal = () => {
  const { t } = useTranslation()
  const { isOpen, closeModal, getModalData } = useModalStoreV2();
  const queryClient = useQueryClient();
  const [startEnroll, setStartEnroll] = useState(false)
  const {
    videoRef,
    openCamera,
    stopStream,
    timer,
    isRunning,
  } = useCamera();

  const modalData = getModalData("assign-face-id");
  
  const enroll = useEnrollSocket(
    videoRef,
    modalData?.id,
    isRunning && startEnroll
  );

  useEffect(() => {
    if (enroll?.status == "success") {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.all,
      });
    }
  }, [enroll])
  

  return (
    <Popup
      isOpen={isOpen("assign-face-id")} 
      closeModal={() => (closeModal("assign-face-id"))}
      title={t("track-application:student_face_id.heading.title")} 
      description={t("track-application:student_face_id.heading.subtitle")}
      fullWidth
      fullHeight
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Notes */}
        <div className='h-full lg:col-span-1 flex flex-col justify-between'>
          <p
            className="whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{
              __html: t("track-application:student_face_id.notes").replace(
                /<mark>(.*?)<\/mark>/g,
                `<mark class="bg-gray-200 text-gray-900 px-1 rounded">$1</mark>`
              ),
            }}
          />
          <Button
            size='xs'
            fullWidth
            variant={startEnroll ? 'error' : 'success'}
            onClick={() => setStartEnroll(!startEnroll)}
          >
            {startEnroll 
              ? t("track-application:student_face_id.buttons.stop_enrollment")
              : t("track-application:student_face_id.buttons.start_enrollment")
            }
          </Button>
        </div>

        {/* Camera Section */}
        <div className="h-full lg:col-span-3 w-full font-en">
          <Camera videoRef={videoRef}>
            <CameraOverlay position='top-center'>
              <p className={`text-sm sm:text-base font-bold text-center ${modalData?.haveFaceId ? "text-green-600" : "text-red-600"}`}>
                {modalData?.haveFaceId 
                  ? t("track-application:found_face_id") 
                  : t("track-application:Not_found_face_id")
                }
              </p>
            </CameraOverlay>
            <EnrollmentProgressBox data={enroll} />
            <CameraTimer timer={timer} />
            <CameraControllers
              isRunning={isRunning}
              openCamera={openCamera}
              stopStream={stopStream}
            />
            <CameraAxisGuide />
          </Camera>
        </div>
      </div>
    </Popup>
  )
}

export default AssignFaceIdModal