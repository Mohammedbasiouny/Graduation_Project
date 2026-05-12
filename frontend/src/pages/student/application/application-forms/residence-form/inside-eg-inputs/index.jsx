import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './validation';
import ResidenceInfoSection from './residence-info-section';
import Heading from "@/components/ui/Heading";
import { useEffect } from "react";
import { useChangeResidenceInfo } from "@/hooks/api/regestration.hooks";
import ResidenceInfoSectionSkeletion from "./residence-info-section/Skeletion";
import { useHandleMutationResponse } from "../../../hooks";
import FormNavigationButtons from "../../components/FormNavigationButtons";

const InsideInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();

  const { register, handleSubmit, formState: { errors }, control, watch, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!data) return;
    reset(data);
  }, [data, reset])

  const { 
    mutate: changeResidenceInfo,
    isPending: residenceInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeResidenceInfo(true);

  const onSubmit = (data) => {
    data.is_inside_egypt = true
    data.country = "EG"
    changeResidenceInfo(data)
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
          <ResidenceInfoSection register={register} errors={errors} control={control} watch={watch} />
        )}
      </div>

      <FormNavigationButtons
        isLoading={isLoading || residenceInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", "student")}
        onNext={() => setParam("step", ["new", "all"].includes(getParam("current_period")) ? "pre_uni" : "academic")}
      />
    </form>
  )
}

export default InsideInputs
