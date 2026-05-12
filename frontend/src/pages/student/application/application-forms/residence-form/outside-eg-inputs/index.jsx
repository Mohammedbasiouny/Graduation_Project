import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import { validationSchema as validationSchemaFunction } from './validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { objectToFormData } from '@/utils/api.utils';
import ResidenceInfoSection from './residence-info-section';
import ResidenceInfoSectionSkeletion from './residence-info-section/Skeletion';
import { useEffect, useState } from "react";
import { useChangeResidenceInfo } from "@/hooks/api/regestration.hooks";
import { useHandleMutationResponse } from "../../../hooks";
import UploadFilesSection from "../../components/UploadFilesSection";
import FormNavigationButtons from "../../components/FormNavigationButtons";

const OutsideInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();

  const [validationSchema, setValidationSchema] = useState(validationSchemaFunction({ requiredFiles: true }))


  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!data) return;

    setValidationSchema(validationSchemaFunction({ requiredFiles: false }))

    reset(data);
  }, [data, reset])

  const { 
    mutate: changeResidenceInfo,
    isPending: residenceInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeResidenceInfo(false);

  const onSubmit = (data) => {
    const formData = objectToFormData(data);
    formData.set("is_inside_egypt", false)
    changeResidenceInfo(formData)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })


  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.residence.residence_heading.title")}
          subtitle={t("application-steps:forms.residence.residence_heading.subtitle")}
        />
        {isLoading ? (
          <ResidenceInfoSectionSkeletion />
        ) : (
          <ResidenceInfoSection register={register} errors={errors} control={control} />
        )}
      </div>

      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <UploadFilesSection
        register={register}
        errors={errors}
        fields={[
          {
            name: "visa_or_residency_image",
            translationKey: "visa_or_residency_image",
          }
        ]}
      />

      <FormNavigationButtons
        isLoading={isLoading || residenceInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", "student")}
        onNext={() => setParam("step", ["new", "all"].includes(getParam("current_period")) ? "pre_uni" : "academic")}
      />
    </form>
  )
}

export default OutsideInputs
