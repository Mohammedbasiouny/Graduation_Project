import { useTranslation } from 'react-i18next'
import Heading from '@/components/ui/Heading'
import DocumentsSection from './sections/DocumentsSection'
import HousingSection from './sections/HousingSection'
import MedicalSection from './sections/MedicalSection'
import ParentsStatusSection from './sections/ParentsStatusSection'
import GuardianSection from './sections/GuardianSection'
import AcadmicSection from './sections/AcadmicSection'
import PreUniEduSection from './sections/PreUniSection'
import ResidenceSection from './sections/ResidenceSection'
import PersonalSection from './sections/PersonalSection'
import CollapsibleSectionSkeleton from './components/CollapsibleSectionSkeleton'
import { Button } from '@/components/ui/Button'
import ApplicationSummaryCard from './cards/ApplicationSummaryCard'
import DeleteApplicationModal from './popup/DeleteApplicationModal'
import ApplicationStatusCard from './cards/ApplicationStatusCard'
import ResultSection from './sections/ResultSection'
import { useAuthStore } from '@/store/use-auth.store'
import ChangeStudentResultModal from './popup/ChangeStudentResultModal'
import { Alert } from '@/components/ui/Alert'
import { getResultState } from '@/utils/result-state.utils'
import LockedOverlay from '@/components/ui/LockedOverlay'
import AllocationSection from './sections/AllocationSection'
import AssignFaceIdCard from './cards/AssignFaceIdCard'
import AssignFaceIdModal from './popup/AssignFaceIdModal'

const ApplicationDetails = ({ data }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore();

  const {
    personalInfo,
    residenceInfo,
    preUniEdu,
    academicInfo,
    guardianInfo,
    parentsStatus,
    medicalInfo,
    housingInfo,
    documents,
    student,
    completedSteps,
    applicationResult,
    isCompleted,
    isFinallyAccepted,
    haveFaceId,
    isLoading
  } = data
  
  const result = getResultState("pending")

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 min-h-screen space-y-5 py-16 px-6 md:px-10">
      
      {/* Main Heading */}
      <div className="max-w-4xl mx-auto text-center">
        <Heading
          title={t("track-application:heading.title")}
          subtitle={t("track-application:heading.subtitle")}
          align="center"
        />
      </div>

        {user?.role === "student" && (
          <LockedOverlay status={!isCompleted} message={t("track-application:must_complete_it")}>
            <div className='max-w-6xl mx-auto'>
              <Alert
                icon={result?.icon}
                title={t("track-application:result_student.title")}
                type={result?.type}
                dismissible={false}
              >
                {/* description */}
                <p className="text-sm text-gray-600 mb-4">
                  {t("track-application:result_student.description")}
                </p>

                {/* result section */}
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-lg text-black mb-1">
                    {t("track-application:result_student.result_label")}
                  </p>

                  <div className={`text-base font-semibold ${result?.color}`}>
                    {result?.text}
                  </div>
                </div>

                {/* message section */}
                <div className="bg-white p-4 rounded-lg mb-2">
                  <p className="text-lg text-black">
                    {t("track-application:result_student.message_label")}
                  </p>

                  <p className="text-base text-gray-800 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
                    corporis voluptatem? Accusantium quod quia dolorem officia eaque
                    debitis similique ex enim praesentium blanditiis voluptatem tempora,
                    sapiente aperiam illum atque ad!
                  </p>
                </div>
              </Alert>
            </div>
          </LockedOverlay>
        )}

      <div className="flex flex-col lg:flex-row-reverse gap-5">
        {/* Sticky Summary Card */}
        <div className="lg:w-1/4">
          <div className="sticky top-5 space-y-2"> {/* one sticky wrapper */}
            {user?.role === "admin" && (
              <LockedOverlay status={!isFinallyAccepted} message={t("track-application:must_finally_accepted")}>
                <AssignFaceIdCard data={{ haveFaceId, student_id: student?.id }} />
              </LockedOverlay>
            )}
            <ApplicationStatusCard completedSteps={completedSteps} />
            <ApplicationSummaryCard student={student} />
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto lg:w-3/4 space-y-10">
          {isLoading ? (
            Array.from({ length: 11 }).map((_, idx) => (
              <CollapsibleSectionSkeleton key={idx} />
            ))
          ) : (
            <>
                {user?.role === "admin" && (
                  <LockedOverlay status={!isCompleted} message={t("track-application:must_complete_it")}>
                    <ResultSection data={applicationResult} />
                  </LockedOverlay>
                )}
                {user?.role === "admin" && (
                  <LockedOverlay status={!isFinallyAccepted || !haveFaceId} message={t("track-application:must_have_face_id_and_finally_accepted")}>
                    <AllocationSection data={applicationResult} />
                  </LockedOverlay>
                )}

              <PersonalSection data={personalInfo} />

              <ResidenceSection data={residenceInfo} />

              {student?.is_new_student && (
                <>
                  <PreUniEduSection data={preUniEdu} />
                </>
              )}

              <AcadmicSection data={academicInfo} />

              {student?.is_egyptian_national && (
                <>
                  <GuardianSection data={guardianInfo} />

                  <ParentsStatusSection data={parentsStatus} />
                </>
              )}

              <MedicalSection data={medicalInfo} />

              <HousingSection data={housingInfo} />

              <DocumentsSection data={documents} />
            </>
          )}
        </div>
      </div>

      <DeleteApplicationModal />
      <ChangeStudentResultModal />
      <AssignFaceIdModal />
    </div>
  )
}

export default ApplicationDetails