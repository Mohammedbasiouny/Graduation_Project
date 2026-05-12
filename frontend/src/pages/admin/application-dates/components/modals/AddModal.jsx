import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import ApplicationDateInputs from '../inputs/ApplicationDateInputs';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../../validation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { useCreateApplicationDate } from '@/hooks/api/application-dates.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';
import { formatToDateOnly } from '@/utils/format-date-and-time.utils';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema()),
    mode: 'onChange',
  });

  const { 
    mutate: createApplicationDate,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateApplicationDate();

    /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createApplicationDate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset({
        name: "",
        startAt: "",
        endAt: "",
        university: "",
        studentType: "",
      })
      closeModal("add")
      openModal("view", { id: data?.data?.data?.id });
    } if (isError) {
      const res = error.response;
      if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("add")} 
      closeModal={() => closeModal("add")}
      title={t("application-dates:modals.add.title")} 
      description={t("application-dates:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<ApplicationDateInputs register={register} errors={errors} control={control} />}
        <div className='flex gap-2'>
          <Button 
            variant="success"
            size="md"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t("buttons:isLoading") : t("buttons:add")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            type="button"
            onClick={() => closeModal("add")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
