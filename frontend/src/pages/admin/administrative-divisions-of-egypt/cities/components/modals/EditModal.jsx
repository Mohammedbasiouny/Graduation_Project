import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../../validation';
import { useForm } from 'react-hook-form';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { useCity, useUpdateCity } from '@/hooks/api/cities.hooks';
import CityInpusSkeleton from '../inputs/CityInputsSkeleton';
import CityInputs from '../inputs/CityInputs';

const EditModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-city");

  /* ---------------- Data State ---------------- */
  const [city, setCity] = useState(null);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useCity(modalData?.id);
  
  const { register, handleSubmit, formState: { errors }, reset, setError, control, watch } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateCity,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateCity();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;
    
    const row = data.data.data;

    setCity(row);

    // Reset form with row data
    reset({
      name: row.name,
      governorate_id: row.governorate_id,
      police_station_id: row.police_station_id,
      is_visible: row.is_visible,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!city?.id) return;
    updateCity({ id: city.id, data });
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
      isOpen={isOpen("edit-city")} 
      closeModal={() => closeModal("edit-city")}
      title={t("cities:modals.edit.title")} 
      description={t("cities:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'> 
        {isLoading ? (
          <CityInpusSkeleton /> 
        ) : (
          <CityInputs 
            register={register} 
            errors={errors} 
            control={control}
            watch={watch}
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
            onClick={() => closeModal("edit-city")}
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
