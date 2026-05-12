import { Button } from '@/components/ui/Button';
import { Camera, CameraAxisGuide, CameraControllers, CameraOverlay, CameraTimer, EnrollmentProgressBox, FaceOverlay } from '@/components/ui/Camera';
import { Popup } from '@/components/ui/Popup'
import useCamera from '@/hooks/use-camera.hook';
import { regestrationKeys } from '@/keys/resources/regestration.keys';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import useRecognizeFaceSocket from './hook';

const AttendanceByFaceIdModal = () => {
  const { t } = useTranslation()
  const { isOpen, closeModal, getModalData } = useModalStoreV2();
  const [startRecognize, setStartRecognize] = useState(false)
  const {
    videoRef,
    openCamera,
    stopStream,
    timer,
    isRunning,
  } = useCamera();

  const [recognizedFaces, setRecognizedFaces] = useState([])

  const modalData = getModalData("attendance-face-id");
  
  const { faces } = useRecognizeFaceSocket(
    videoRef,
    isRunning && startRecognize
  );

  useEffect(() => {
    if(isRunning === false || startRecognize === false) {
      setRecognizedFaces([]);
    }
  }, [isRunning, startRecognize])

  useEffect(() => {
    if(faces?.length > 0) {
      setRecognizedFaces(faces);
    }
  }, [faces])

  return (
    <Popup
      isOpen={isOpen("attendance-face-id")} 
      closeModal={() => (closeModal("attendance-face-id"))}
      title={t("manage-attendance:attendance_by_face_id.heading.title")} 
      description={t("manage-attendance:attendance_by_face_id.heading.subtitle")}
      fullWidth
      fullHeight
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notes */}
        <div className='h-full lg:col-span-1 flex flex-col justify-between gap-10'>
          <p
            className="whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{
              __html: t("manage-attendance:attendance_by_face_id.notes").replace(
                /<mark>(.*?)<\/mark>/g,
                `<mark class="bg-gray-200 text-gray-900 px-1 rounded">$1</mark>`
              ),
            }}
          />
          <Button
            size='xs'
            fullWidth
            variant={startRecognize ? 'error' : 'success'}
            onClick={() => setStartRecognize(!startRecognize)}
          >
            {startRecognize 
              ? t("manage-attendance:attendance_by_face_id.buttons.stop_enrollment")
              : t("manage-attendance:attendance_by_face_id.buttons.start_enrollment")
            }
          </Button>
        </div>

        {/* Camera Section */}
        <div className="lg:col-span-3 w-full h-full font-en">
          <Camera videoRef={videoRef}>
            <CameraOverlay position='top-left'>
              {recognizedFaces?.length > 0 ? (
                <div className="flex flex-col items-center gap-2">

                  {recognizedFaces.map((face, index) => {
                    const isUnknown =
                      !face.student_id || !face.full_name;

                    return (
                      <div
                        key={index}
                        className={`
                          px-4 py-2 rounded-xl border backdrop-blur-md shadow-lg
                          transition-all duration-300
                          ${isUnknown
                            ? "bg-red-500/10 border-red-400 text-red-600"
                            : "bg-green-500/10 border-green-400 text-green-600"
                          }
                        `}
                      >
                        <p className="text-sm sm:text-base font-black text-center">
                          {isUnknown
                            ? t("manage-attendance:attendance_by_face_id.not_found_face_id")
                            : `${face.full_name} - ID: ${face.student_id}`
                          }
                        </p>

                        {!isUnknown && face?.confidence && (
                          <p className="text-xs text-center opacity-80 mt-1">
                            {(face.confidence * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className="text-sm sm:text-base font-bold text-center text-red-600">
                  {t("manage-attendance:attendance_by_face_id.not_found_face_id")}
                </p>
              )}
            </CameraOverlay>
            <CameraTimer timer={timer} />
            <FaceOverlay videoRef={videoRef} faces={recognizedFaces} />
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

export default AttendanceByFaceIdModal