import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../../validation';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { Button } from '@/components/ui/Button';
import { useCreateCity } from '@/hooks/api/cities.hooks';
import CityInputs from '../inputs/CityInputs';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError, reset, control, watch, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: createCity,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateCity();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createCity(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset({
        name: "",
        is_visible: "",
        governorate_id: "",
        police_station_id: "",
      })
      closeModal("add-city")
      openModal("view-city", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-city")} 
      closeModal={() => closeModal('add-city')}
      title={t("cities:modals.add.title")} 
      description={t("cities:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<CityInputs register={register} errors={errors} control={control} watch={watch} setValue={setValue} />}
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
            onClick={() => closeModal("add-city")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
