import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useForm } from 'react-hook-form';
import { departmentValidationSchema } from '../validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateDepartment } from '@/hooks/api/departments.hooks';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { Button } from '@/components/ui/Button';
import DepartmentInputs from '../inputs/DepartmentInputs';
import { useParams } from 'react-router';

const AddDepartmentModal = () => {
  const { isOpen, openModal, closeModal, getModalData } = useModalStoreV2();
  const modalData = getModalData("add-department");
  const { t } = useTranslation();
  const { uni } = useParams();

  const [university, setUniversity] = useState("")

  const { register, handleSubmit, formState: { errors }, setError, reset, control } = useForm({
    resolver: yupResolver(departmentValidationSchema),
    mode: 'onChange',
    defaultValues: {
      faculty_id: ""
    }
  });

  const { 
    mutate: createDepartment,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateDepartment();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createDepartment(data);
  };

  useEffect(() => {
    if (!modalData?.college) return;

    reset({
      faculty_id: modalData.college.collegeID,
    });
  }, [modalData?.college, reset, uni]);

  useEffect(() => {
    if (modalData?.college?.university) {
      setUniversity(modalData.college.university);
    } else if (uni) {
      setUniversity(uni);
    }
  }, [modalData?.college?.university, uni]);


  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset({
        name: "",
        faculty_id: "",
        is_visible: "",
      })
      closeModal("add-department")
      openModal("view-department", { id: data?.data?.data?.id });
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
      isOpen={isOpen("add-department")} 
      closeModal={() => closeModal("add-department")}
      title={t("manage-departments:modals.add.title")} 
      description={t("manage-departments:modals.add.description")}
    >

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<DepartmentInputs register={register} errors={errors} control={control} uni={university} />}
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
            onClick={() => closeModal("add-department")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddDepartmentModal
