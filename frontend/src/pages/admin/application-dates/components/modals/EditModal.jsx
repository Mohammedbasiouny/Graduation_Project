import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useForm } from 'react-hook-form';
import { validationSchema as validationSchemaFunction } from '../../validation';
import { yupResolver } from '@hookform/resolvers/yup';
import ApplicationDateInputs from '../inputs/ApplicationDateInputs';
import { useEffect, useState } from 'react';
import { useApplicationDate, useUpdateApplicationDate } from '@/hooks/api/application-dates.hooks';
import { formatToDatetimeLocal } from '@/utils/format-date-and-time.utils';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';
import ApplicationDateInputsSkeleton from '../inputs/ApplicationDateInputsSkeleton';

const EditModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit");

  /* ---------------- Data State ---------------- */
  const [applicationDate, setApplicationDate] = useState(null);
  const [validationSchema, setValidationSchema] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useApplicationDate(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateApplicationDate,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateApplicationDate();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    // Update validation schema with custom startDate
    setValidationSchema(validationSchemaFunction({ customStartDate: row.startAt }));
    setApplicationDate(row);
    
    // Reset form with row data
    reset({
      name: row.name,
      startAt: formatToDatetimeLocal(row.startAt), // ensure date input format
      endAt: formatToDatetimeLocal(row.endAt), // ensure date input format
      university: row.university,
      studentType: row.studentType,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!applicationDate?.id) return;
    updateApplicationDate({ id: applicationDate.id, data });
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
      isOpen={isOpen("edit")} 
      closeModal={() => closeModal("edit")}
      title={t("application-dates:modals.edit.title")} 
      description={t("application-dates:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {!validationSchema || isLoading ? (
            <ApplicationDateInputsSkeleton /> 
          ) : (
            <ApplicationDateInputs 
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
            {isLoading || isUpdating ? t("buttons:isLoading") : t("buttons:edit")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            disabled={isLoading}
            onClick={() => closeModal("edit")}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditModal
