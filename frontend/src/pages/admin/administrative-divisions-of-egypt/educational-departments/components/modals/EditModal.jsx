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
import { useEduDepartment, useUpdateEduDepartment } from '@/hooks/api/edu-departments.hooks';
import EducationalDepartmentInpusSkeleton from '../inputs/EducationalDepartmentInputsSkeleton';
import EducationalDepartmentInputs from '../inputs/EducationalDepartmentInputs';

const EditModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-educational-department");

  /* ---------------- Data State ---------------- */
  const [eduDepartment, setEduDepartment] = useState(null);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useEduDepartment(modalData?.id);
  
  const { register, handleSubmit, formState: { errors }, reset, setError, control } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateEduDepartment,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateEduDepartment();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;
    
    const row = data.data.data;

    setEduDepartment(row);

    // Reset form with row data
    reset({
      name: row.name,
      governorate_id: row.governorate_id,
      is_visible: row.is_visible,
      acceptance_status: row.acceptance_status,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!eduDepartment?.id) return;
    updateEduDepartment({ id: eduDepartment.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      }  if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("edit-educational-department")} 
      closeModal={() => closeModal("edit-educational-department")}
      title={t("educational-departments:modals.edit.title")} 
      description={t("educational-departments:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'> 
        {isLoading ? (
          <EducationalDepartmentInpusSkeleton /> 
        ) : (
          <EducationalDepartmentInputs 
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
            onClick={() => closeModal("edit-educational-department")}
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
