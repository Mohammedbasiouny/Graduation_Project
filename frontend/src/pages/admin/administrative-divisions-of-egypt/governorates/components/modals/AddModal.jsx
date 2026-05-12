import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import GovernorateInputs from '../inputs/GovernorateInputs';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { useCreateGovernorate } from '@/hooks/api/governorates.hooks';
import { validationSchema } from '../../validation';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: createGovernorate,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateGovernorate();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createGovernorate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset({
        name: "",
        is_visible: "",
      })
      closeModal("add-governorate")
      openModal("view-governorate", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-governorate")} 
      closeModal={() => closeModal('add-governorate')}
      title={t("governorates:modals.add.title")} 
      description={t("governorates:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<GovernorateInputs register={register} errors={errors} />}
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
            onClick={() => closeModal("add-governorate")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal

