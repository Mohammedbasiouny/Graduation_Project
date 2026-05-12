import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { departmentValidationSchema } from '../validation';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import DepartmentInputsSkeleton from '../inputs/DepartmentInputsSkeleton';
import DepartmentInputs from '../inputs/DepartmentInputs';
import { useDepartment, useUpdateDepartment } from '@/hooks/api/departments.hooks';

const EditDepartmentModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-department");

  /* ---------------- Data State ---------------- */
  const [department, setDepartment] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useDepartment(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(departmentValidationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateDepartment,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateDepartment();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;
    setDepartment({
      id: row.id,
      faculty_id: row.faculty_id,
      name: row.name,
      university: row.university,
      is_visible: row.is_visible,
    });

    // Reset form with row data
    reset({
      name: row.name,
      faculty_id: row.faculty_id,
      is_visible: row.is_visible,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!department?.id) return;
    updateDepartment({ id: department.id, data });
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
      isOpen={isOpen("edit-department")} 
      closeModal={() => closeModal("edit-department")}
      title={t("manage-departments:modals.edit.title")} 
      description={t("manage-departments:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <DepartmentInputsSkeleton /> 
          ) : (
            <DepartmentInputs 
              register={register} 
              errors={errors} 
              control={control} 
              uni={department?.university}
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
            onClick={() => closeModal("edit-department")}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditDepartmentModal
