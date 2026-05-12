import { Button } from '@/components/ui/Button';
import { Popup } from '@/components/ui/Popup';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { resultValidationSchema } from '../validation';
import { useForm } from 'react-hook-form';
import { useStudentApplicationResult, useUpdateApplicationResult } from '@/hooks/api/students-applications.hooks';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';
import { ResultInputs, ResultInputsSkeleton } from '../inputs/ResultInputs';

const ChangeStudentResultModal = () => {
  const { isOpen, closeModal, getModalData } = useModalStoreV2();
  const { t } = useTranslation();
  const modalData = getModalData("change-student-result");
  const [result, setResult] = useState(null);

  const { data, isLoading } = useStudentApplicationResult(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(resultValidationSchema),
    mode: 'onChange',
  });

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data) return;
    
    const row = data.data;

    setResult(row);

    // Reset form with row data
    reset({
      security_result_inquiry: row.security_result_inquiry,
      candidate_for_final_acceptance: row.candidate_for_final_acceptance,
      final_acceptance: row.final_acceptance,
      message_to_student: row.message_to_student,
    });
  }, [data, reset]);


  const handleCloseModal = () => {
      reset({
        security_result_inquiry: "",
        candidate_for_final_acceptance: "",
        final_acceptance: "",
        message_to_student: "",
      })
      closeModal("change-student-result")
  }

  const { 
    mutate: updateApplicationResult,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateApplicationResult();


  const onSubmit = (data) => {
    if (!modalData?.id) return;
    updateApplicationResult({ id: modalData.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      } if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("change-student-result")} 
      closeModal={() => closeModal("change-student-result")}
      title={t("track-application:modals.change_result.title")} 
      description={t("track-application:modals.change_result.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <ResultInputsSkeleton /> 
          ) : (
            <ResultInputs 
              register={register} 
              errors={errors} 
              control={control}
            />
        )}
        <div className='flex gap-2'>
          <Button 
            variant="info"
            size="md"
            fullWidth
            isLoading={isLoading || isUpdating}
            disabled={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? t("buttons:isLoading") : t("track-application:modals.change_result.buttons.yes")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            disabled={isLoading}
            onClick={() => closeModal("change-student-result")}
            type="button"
          >
            {t("track-application:modals.change_result.buttons.no")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default ChangeStudentResultModal