import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { showToast } from '@/utils/toast.util';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { collegeValidationSchema } from '../validation';
import { useForm } from 'react-hook-form';
import { useCreateFaculty } from '@/hooks/api/faculties.hooks';
import { Button } from '@/components/ui/Button';
import CollegeInputs from '../inputs/CollegeInputs';
import { useParams } from 'react-router';

const AddCollegeModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const { uni } = useParams();
  
  const { register, handleSubmit, formState: { errors }, setError, reset, control } = useForm({
    resolver: yupResolver(collegeValidationSchema),
    mode: 'onChange',
    defaultValues: {
      university: uni || ""
    }
  });

  const { 
    mutate: createCollege,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateFaculty();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createCollege(data);
  };

  const handleCloseModal = () => {
      reset({
        name: "",
        university: uni || "",
        is_visible: "",
      })
      closeModal("add-college")
  }

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      handleCloseModal()
      openModal("view-college", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-college")} 
      closeModal={handleCloseModal}
      title={t("manage-colleges:modals.add.title")} 
      description={t("manage-colleges:modals.add.description")}
    >

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<CollegeInputs register={register} errors={errors} control={control} />}
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
            onClick={handleCloseModal}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddCollegeModal
