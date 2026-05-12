import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../../validation';
import { useForm } from 'react-hook-form';
import { useCreatePoliceStation } from '@/hooks/api/police-stations.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import PoliceStationInputs from '../inputs/PoliceStationInputs';
import { Button } from '@/components/ui/Button';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError, reset, control, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: createPoliceStation,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreatePoliceStation();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createPoliceStation(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset({
        name: "",
        is_visible: "",
        governorate_id: "",
        acceptance_status: "",
      })
      closeModal("add-police-station")
      openModal("view-police-station", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-police-station")} 
      closeModal={() => closeModal('add-police-station')}
      title={t("police-stations:modals.add.title")} 
      description={t("police-stations:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<PoliceStationInputs register={register} errors={errors} control={control} setValue={setValue} />}
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
            onClick={() => closeModal("add-police-station")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
