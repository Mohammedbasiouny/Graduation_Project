import { Button } from '@/components/ui/Button';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import FileUpload from '@/components/ui/Form/FileUpload';
import { Label } from '@/components/ui/Form/Label';
import { Popup } from '@/components/ui/Popup';
import { applicationDatesKeys } from '@/keys/resources/application-dates.keys';
import { manageAcceptanceService } from '@/services/manage-acceptance.service';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { applyFormServerErrors, objectToFormData } from '@/utils/api.utils';
import { showToast } from '@/utils/toast.util';
import { file } from '@/validation/fields';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";

const UploadCandidatesModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("upload-candidates");
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        file: file({
          required: true,
          maxSize: 30,
          allowedTypes: [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ]
        }),
      })
    ),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    if (!modalData?.id) return;

    setIsLoading(true);

    try {
      const formData = objectToFormData(data);
      await manageAcceptanceService.uploadStudents(
        modalData.id,
        { file: formData.get("file") }
      );
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.statistics,
      });
      showToast("success", t("messages:updated_successfully"));
    } catch (error) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      } if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popup
      isOpen={isOpen("upload-candidates")}
      closeModal={() => closeModal("upload-candidates")}
      title={t("manage-acceptance:modals.upload_candidates.title")}
      description={t("manage-acceptance:modals.upload_candidates.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <Field className="space-y-2">
          <Label text={t(`fields:file.label`)} required />

          <FileUpload
            {...register("file")}
            error={errors?.file?.message}
            maxFiles={1}
          />

          <DescriptionText
            description={t(`fields:file.description`)}
          />
        </Field>

        <div className="flex gap-2">
          <Button
            variant="success"
            size="md"
            fullWidth
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t("buttons:isLoading") : t("buttons:upload")}
          </Button>

          <Button
            variant="cancel"
            size="md"
            fullWidth
            onClick={() => closeModal("upload-candidates")}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default UploadCandidatesModal;