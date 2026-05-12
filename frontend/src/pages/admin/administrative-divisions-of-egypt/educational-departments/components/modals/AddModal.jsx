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
import { useCreateEduDepartment } from '@/hooks/api/edu-departments.hooks';
import EducationalDepartmentInputs from '../inputs/EducationalDepartmentInputs';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError, reset, control, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: createEduDepartment,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateEduDepartment();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createEduDepartment(data);
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
      closeModal("add-educational-department")
      openModal("view-educational-department", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-educational-department")} 
      closeModal={() => closeModal('add-educational-department')}
      title={t("educational-departments:modals.add.title")} 
      description={t("educational-departments:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<EducationalDepartmentInputs register={register} errors={errors} control={control} setValue={setValue} />}
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
            onClick={() => closeModal("add-educational-department")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
