import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import BuildingInputs from '../inputs/BuildingInputs';
import { validationSchema } from '../validation';
import { useEffect, useState } from 'react';
import { useBuilding, useUpdateBuilding } from '@/hooks/api/buildings.hooks';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import BuildingInputsSkeleton from '../inputs/BuildingInputsSkeleton';

const EditBuildingModal = () => {
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const { t } = useTranslation();
  const modalData = getModalData("edit-building");

  /* ---------------- Data State ---------------- */
  const [building, setBuilding] = useState(null);
  
  /* ---------------- API ---------------- */
  const { data, isLoading } = useBuilding(modalData?.id);
  

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateBuilding,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateBuilding();

  useEffect(() => {
    if (!data?.data?.data) return;
    
    const row = data.data.data;

    setBuilding(row);

    // Reset form with row data
    reset(row);
  }, [data, reset]);


  const onSubmit = (data) => {
    if (!building?.id) return;
    updateBuilding({ id: building.id, data });
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
      isOpen={isOpen("edit-building")} 
      closeModal={() => closeModal('edit-building')}
      title={t("buildings:modals.edit.title")} 
      description={t("buildings:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <BuildingInputsSkeleton /> 
          ) : (
            <BuildingInputs register={register} errors={errors} control={control} />
        )}
        <div className='flex gap-2'>
          <Button 
            variant="info"
            size="md"
            fullWidth
            isLoading={isLoading || isUpdating}
            disabled={isLoading || isUpdating}
          >
            {t("buttons:edit")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            disabled={isLoading}
            type="button"
            onClick={() => closeModal("edit-building")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditBuildingModal
