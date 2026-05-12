import { Activity, useEffect, useRef, useState } from 'react'
import Stepper from '@/components/ui/Stepper';
import Heading from '@/components/ui/Heading';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import HousingForm from './housing-form';
import PersonalInfoForm from './personal-info-form';
import ResidenceForm from './residence-form';
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import PreUniForm from './pre-uni-form';
import AcademicForm from './academic-form';
import MedicalForm from './medical-form';
import GuardianForm from './guardian-form';
import { useGetCurrentPeriod, useManageFormsData } from '../hooks';
import CopyText from '@/components/ui/CopyText';
import { translateNumber } from '@/i18n/utils';
import UploadedModalPopup from './components/UploadedModalPopup';
import RedirectText from '@/components/ui/RedirectText';

const ApplicationFormsPage = () => {
  const { nationality } = useParams();
  const [activeStep, ] = useState(0);
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();
  const ref = useRef(null);

  const currentStep = getParam("step") ?? "student";
  const currentPeriod = getParam("current_period") ?? "all";

  const { 
    student, 
    personalInfo, 
    residenceInfo, 
    preUniEdu, 
    academicInfo, 
    guardianInfo,
    parentsStatus,
    medicalInfo, 
    housingInfo, 
    documents, 
    isLoading 
  } = useManageFormsData()

  const stepsOrder = [
    "student",
    "residence",
    ...(["new", "all"].includes(currentPeriod) ? ["pre_uni"] : []),
    "academic",
    ...(nationality === "egyptian" ? ["relatives"] : []),
    "medical",
    "housing",
  ];
  
  const steps = stepsOrder.map((stepKey, index) => {
  const currentIndex = stepsOrder.indexOf(currentStep);
  
    return {
      title: t(`application-steps:steps.${stepKey}`),
      isActive: stepKey === currentStep,
      isCompleted: index < currentIndex,
    };
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [getParam]);

  useEffect(() => {
    if (!student) return;
    const { is_resident_inside_egypt, is_new_student } = student
    if (is_resident_inside_egypt !== null) {
      setParam("is_inside_egypt", is_resident_inside_egypt)
    }
    if (is_new_student !== null) {
      setParam("student_type", is_new_student ? "new" : "old")
    }
  }, [student])
  

  return (
    <div className="w-full flex flex-col items-center space-y-10 p-6 min-h-screen bg-(--gray-lightest)" ref={ref}>
      <Heading 
        title={t("application-steps:heading.title")}
        subtitle={t("application-steps:heading.subtitle")}
      />
      <div className='w-full flex flex-col items-center justify-center gap-5'>
        <Stepper
          steps={steps}
          activeStep={activeStep}
        />
        {student && (
          <div className='w-fit flex flex-col items-center gap-3'>
            <CopyText text={student?.id} styled>
              <p className='space-x-3'>
                <span className='text-lg text-gray-700'>
                { t("application-steps:messages.application_number")}:
                </span>
                <span className='text-xl text-gray-900 font-black'>
                  {translateNumber(student?.id)}
                </span>
              </p>
            </CopyText>
            <RedirectText
              linkTo={"/student/track-application"}
              linkText={t("application-steps:buttons.track_application")}
              underlineText
              centerText
            />
          </div>
        )}
      </div>

      <Activity mode={currentStep === "student" ? "visible" : "hidden"}>
        <PersonalInfoForm data={personalInfo} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "residence" ? "visible" : "hidden"}>
        <ResidenceForm data={residenceInfo} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "pre_uni" ? "visible" : "hidden"}>
        <PreUniForm data={preUniEdu} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "academic" ? "visible" : "hidden"}>
        <AcademicForm data={academicInfo} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "relatives" ? "visible" : "hidden"}>
        <GuardianForm guardianInfo={guardianInfo} parentsStatus={parentsStatus} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "medical" ? "visible" : "hidden"}>
        <MedicalForm data={medicalInfo} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "housing" ? "visible" : "hidden"}>
        <HousingForm data={housingInfo} isLoading={isLoading} />
      </Activity>

      <UploadedModalPopup documents={documents} />
    </div>
  );
}

export default ApplicationFormsPage
