import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import BuildingInputs from '../inputs/BuildingInputs';
import { validationSchema } from '../validation';
import { useCreateBuilding } from '@/hooks/api/buildings.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';

const AddBuildingModal = () => {
  const { isOpen, closeModal, openModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: createBuilding,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateBuilding();

  const onSubmit = (data) => {
    createBuilding(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset()
      closeModal("add-building")
      openModal("view-building", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-building")} 
      closeModal={() => closeModal('add-building')}
      title={t("buildings:modals.add.title")} 
      description={t("buildings:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<BuildingInputs register={register} errors={errors} control={control} />}
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
            onClick={() => closeModal("add-building")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddBuildingModal
