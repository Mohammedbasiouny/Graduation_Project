import { useCurrentApplicationDate, usePeriodStatus } from "@/hooks/api/application-dates.hooks";
import { useRegestrationProfile } from "@/hooks/api/regestration.hooks";
import { applyFormServerErrors, showServerMessages } from "@/utils/api.utils";
import { getPeriodDetails } from "@/utils/application-dates.utils";
import { showToast } from "@/utils/toast.util";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useGetCurrentPeriod = () => {
  const [currentPeriod, setCurrentPeriod] = useState(null)
  const [message, setMessage] = useState(null)
  
  const { t } = useTranslation();
  const { data, isLoading } = useCurrentApplicationDate()

  useEffect(() => {
    if (!data?.data?.data) {
      setMessage(t("application-dates:not_found.title"))
      return;
    }
    setCurrentPeriod(data.data.data);

    const periodText = getPeriodDetails({
      startAt: data.data.data.startAt,
      endAt: data.data.data.endAt,
      name: data.data.data.name,
      university: t(`universities.${data.data.data.university}`),
      studentType:  t(`fields:student_type.options.${data.data.data.studentType}`)
    });

    setMessage(periodText)
  }, [data]);

  return {
    currentPeriod,
    isLoading,
    message,
  };
};

export const useManageFormsData = () => {
  const { data, isLoading } = useRegestrationProfile();

  const profileData = data?.data?.data;
  const student = profileData?.student;
  const isFilled = (obj) => obj && Object.keys(obj).length > 0;

  // Build completed steps first
  const completedSteps = {
    personalInfoCompleted: isFilled(profileData?.personal_info),
    residenceInfoCompleted: isFilled(profileData?.residence_info),
    preUniEduCompleted: isFilled(profileData?.pre_university_info),
    academicInfoCompleted: isFilled(profileData?.academic_info),
    guardianInfoCompleted: isFilled(profileData?.guardian_info),
    parentsStatusCompleted: isFilled(profileData?.parents_status),
    medicalInfoCompleted: isFilled(profileData?.medical_report),
    housingInfoCompleted: isFilled(profileData?.housing_info),
  };

  if (!student?.is_egyptian_national) {
    delete completedSteps.guardianInfoCompleted;
    delete completedSteps.parentsStatusCompleted;
  }
  if (!student?.is_new_student) {
    delete completedSteps.preUniEduCompleted;
  }

  // Build return object
  const appliedAt = student?.applied_at;

  const attachAppliedAt = (obj) =>
    obj ? { ...obj, applied_at: appliedAt } : obj;

  const result = {
    data: profileData,
    student,
    personalInfo: attachAppliedAt(profileData?.personal_info),
    residenceInfo: attachAppliedAt(profileData?.residence_info),
    academicInfo: attachAppliedAt(profileData?.academic_info),
    medicalInfo: attachAppliedAt(profileData?.medical_report),
    housingInfo: attachAppliedAt(profileData?.housing_info),
    documents: profileData?.documents,
    completedSteps,
    isLoading,
  };

  if (student?.is_egyptian_national) {
    result.guardianInfo = attachAppliedAt(profileData?.guardian_info);
    result.parentsStatus = attachAppliedAt(profileData?.parents_status);
  }
  if (student?.is_new_student) {
    result.preUniEdu = attachAppliedAt(profileData?.pre_university_info)
  }
  return result;
};

export const useHandleMutationResponse = ({ isSuccess, isError, error, resetMutation, setError }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isSuccess && !isError) return;

    if (isSuccess) {
      showToast("success", t("application-steps:messages.saved_successfully"));
    }

    if (isError) {
      const res = error?.response;
      const statusMessages = {
        404: t("application-steps:messages.student_not_fount"),
        409: t("application-steps:messages.user_already_exists_note"),
        415: t("application-steps:messages.upload_required_files_note"),
        422: t("messages:validation_error"),
      };

      if (res?.status) {
        if (res.status === 400) {
          showServerMessages(res?.data?.message, { type: "error", time: 5000 });
        }
        if (res.status === 422) {
          applyFormServerErrors(res?.data?.errors, setError);
        }
        showToast("error", statusMessages[res.status]);
      }
    }

    resetMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);
};

export const useGetPeriodStatus = () => {
  const [periodStatus, setPeriodStatus] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");
  const { data , isLoading} = usePeriodStatus();

  useEffect(() => {
    if (!data?.data?.data?.period) return;

    setPeriodStatus(data.data.data.period.status ?? false);
    setUpdatedAt(data.data.data.period.updated_at ?? "");
  }, [data]);

  return {
    periodStatus,
    updatedAt,
    isLoading
  }
}