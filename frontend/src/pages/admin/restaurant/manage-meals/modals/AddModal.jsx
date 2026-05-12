import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { validationSchema } from '../validation';
import MealInputs from '../inputs/MealInputs';
import { useCreateMeal } from '@/hooks/api/meals.hooks';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';
import { useEffect } from 'react';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });


  const { 
    mutate: createMeal,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateMeal();

    /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createMeal(data);
  };

  const handleCloseModal = () => {
      reset({
        name: "",
        category: "",
        description: "",
        is_active: "",
      })
      closeModal("add-meal")
  }

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      handleCloseModal()
      openModal("view-meal", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-meal")} 
      closeModal={handleCloseModal}
      title={t("meals:modals.add.title")} 
      description={t("meals:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<MealInputs register={register} errors={errors} control={control} />}
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
            onClick={handleCloseModal}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
