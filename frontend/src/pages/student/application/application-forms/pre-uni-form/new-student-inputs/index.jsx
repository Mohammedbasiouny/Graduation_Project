import { Activity, useEffect } from 'react'
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { objectToFormData } from '@/utils/api.utils';
import { inSideEgvalidationSchema, outSideEgvalidationSchema } from './validation';
import PreUniInfoSection from './pre-uni-info-section';
import PreUniInfoSectionSkeletion from './pre-uni-info-section/Skeletion';
import { useChangePreUniEduInfo } from '@/hooks/api/regestration.hooks';
import { useHandleMutationResponse } from '../../../hooks';
import UploadFilesSection from '../../components/UploadFilesSection';
import FormNavigationButtons from '../../components/FormNavigationButtons';

const NewStudentInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { setParam } = useURLSearchParams();

  const form = useForm({
    mode: "onChange",
    resolver: async (formValues, context, options) => {
      const degree = formValues?.certificate_type?.degree ?? 0;
      const requiredFiles = !!data; // or however you detect existing data
      
      const schema =
        formValues?.is_inside_egypt == "true"
          ? inSideEgvalidationSchema({ requiredFiles: !requiredFiles, maxScore: degree })
          : outSideEgvalidationSchema({ requiredFiles: !requiredFiles, maxScore: degree });

      return yupResolver(schema)(formValues, context, options);
    },
  });

  const { register, handleSubmit, formState: { errors }, control, watch, reset, setError } = form;

  const isCertificateFromEgypt = watch("is_inside_egypt");

  useEffect(() => {
    if (!data) return;

    reset({
      ...data,
      is_inside_egypt: data.is_inside_egypt?.toString()
    });

  }, [data, reset]);

  const { 
    mutate: changePreUniEduInfo,
    isPending: preUniEduInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangePreUniEduInfo(isCertificateFromEgypt == "true");

  const onSubmit = (data) => {
    const formData = objectToFormData(data);
    if (data.is_inside_egypt) {
      formData.set("certificate_country", "EG")
    }
    changePreUniEduInfo(formData)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.pre_uni.heading.title")}
          subtitle={t("application-steps:forms.pre_uni.heading.subtitle")}
        />
        {isLoading ? (
          <PreUniInfoSectionSkeletion />
        ) : (
          <PreUniInfoSection 
            register={register} 
            errors={errors} 
            control={control} 
            watch={watch} 
          />
        )}
      </div>

      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <UploadFilesSection
        register={register}
        errors={errors}
        fields={[
          {
            name: "pre_university_certificate",
            translationKey: "certificate_image",
            maxFiles: 5,
            multiple: true,
          }
        ]}
      />

      <FormNavigationButtons
        isLoading={isLoading || preUniEduInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", "residence")}
        onNext={() => setParam("step", "academic")}
      />
    </form>
  )
}

export default NewStudentInputs
