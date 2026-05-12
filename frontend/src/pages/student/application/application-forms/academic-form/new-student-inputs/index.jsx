import { Activity, useEffect } from 'react'
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { objectToFormData } from '@/utils/api.utils';
import AcademiciInfoSection from './academic-info-section';
import { validationSchema } from './validation';
import { useParams } from 'react-router';
import FormNavigationButtons from '../../components/FormNavigationButtons';
import AcademiciInfoSectionSkeletion from './academic-info-section/Skeletion';
import { useHandleMutationResponse } from '../../../hooks';
import { useChangeAcademicInfo } from '@/hooks/api/regestration.hooks';
import UploadFilesSection from '../../components/UploadFilesSection';

const NewStudentInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { setParam, getParam } = useURLSearchParams();
  const { nationality } = useParams();

  const form = useForm({
    mode: "onChange",
    resolver: async (formValues, context, options) => {
      const requiredFiles = !!data;
      
      const schema = validationSchema({ requiredFiles: !requiredFiles });

      return yupResolver(schema)(formValues, context, options);
    },
  });

  const { register, handleSubmit, formState: { errors }, control, watch, reset, setError } = form;

  useEffect(() => {
    if (!data) return;

    reset(data);

  }, [data, reset]);

  const { 
    mutate: changeAcademicInfo,
    isPending: academicInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeAcademicInfo(true);

  const onSubmit = (data) => {
    const formData = objectToFormData(data);
    changeAcademicInfo(formData)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.academic.heading.title")}
          subtitle={t("application-steps:forms.academic.heading.subtitle")}
        />
        {isLoading ? (
          <AcademiciInfoSectionSkeletion />
        ) : (
          <AcademiciInfoSection 
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
            name: "nomination_card_image",
            translationKey: "nomination_card_image"
          }
        ]}
      />

      <FormNavigationButtons
        isLoading={isLoading || academicInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", ["new", "all"].includes(getParam("current_period")) ? "pre_uni" : "residence")}
        onNext={() => setParam("step", nationality == "egyptian" ? "relatives" : "medical")}
      />
    </form>
  )
}

export default NewStudentInputs
