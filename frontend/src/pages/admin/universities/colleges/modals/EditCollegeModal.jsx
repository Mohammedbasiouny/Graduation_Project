import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useState } from 'react';
import { useFaculty, useUpdateFaculty } from '@/hooks/api/faculties.hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { collegeValidationSchema } from '../validation';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import CollegeInputsSkeleton from '../inputs/CollegeInputsSkeleton';
import CollegeInputs from '../inputs/CollegeInputs';

const EditCollegeModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-college");

  /* ---------------- Data State ---------------- */
  const [college, setCollege] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useFaculty(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(collegeValidationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateCollege,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateFaculty();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    setCollege({
      id: row.id,
      name: row.name,
      university: row.university,
      is_visible: row.is_visible,
      is_off_campus: row.is_off_campus,
    });

    // Reset form with row data
    reset({
      name: row.name,
      university: row.university,
      is_visible: row.is_visible,
      is_off_campus: row.is_off_campus ? "true" : "false",
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!college?.id) return;
    updateCollege({ id: college.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      }if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const handleCloseModal = () => {
      reset({
        name: "",
        university: "",
        is_visible: "",
        is_off_campus: "",
      })
      closeModal("edit-college")
  }

  return (
    <Popup
      isOpen={isOpen("edit-college")} 
      closeModal={handleCloseModal}
      title={t("manage-colleges:modals.edit.title")} 
      description={t("manage-colleges:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <CollegeInputsSkeleton /> 
          ) : (
            <CollegeInputs 
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
            onClick={handleCloseModal}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditCollegeModal
