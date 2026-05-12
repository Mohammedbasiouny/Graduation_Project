import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { usePerUniQualification, useUpdatePerUniQualification } from '@/hooks/api/pre-uni-qualifications.hooks';
import { useEffect, useState } from 'react';
import { validationSchema } from '../../validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import CertificateInputsSkeleton from '../inputs/CertificateInputsSkeleton';
import CertificateInputs from '../inputs/CertificateInputs';

const EditModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit");

  /* ---------------- Data State ---------------- */
  const [perUniQualification, setPerUniQualification] = useState(null);
  
  /* ---------------- API ---------------- */
  const { data, isLoading } = usePerUniQualification(modalData?.id);
  
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updatePerUniQualification,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdatePerUniQualification();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    setPerUniQualification(row);

    // Reset form with row data
    reset({
      name: row.name,
      degree: row.degree,
      notes: row.notes,
      is_visible: row.is_visible,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!perUniQualification?.id) return;
    updatePerUniQualification({ id: perUniQualification.id, data });
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
      isOpen={isOpen("edit")} 
      closeModal={() => closeModal("edit")}
      title={t("educational-certificates:modals.edit.title")} 
      description={t("educational-certificates:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {!validationSchema || isLoading ? (
            <CertificateInputsSkeleton /> 
          ) : (
            <CertificateInputs 
              register={register} 
              errors={errors} 
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
            onClick={() => closeModal("edit")}
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
