import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { yupResolver } from '@hookform/resolvers/yup';
import ParentsCurrentStatusInputs from './inputs/ParentsCurrentStatusInputs';
import FormNavigationButtons from '../../../components/FormNavigationButtons';
import { useHandleMutationResponse } from '../../../../hooks';
import { useChangeParentsInfo } from '@/hooks/api/regestration.hooks';
import { useEffect } from 'react';
import ParentsCurrentStatusSkeleton from './inputs/ParentsCurrentStatusSkeleton';

const ParentsCurrentStatusForm = ({ data = null, isLoading = false }) => {
  const { setParam } = useURLSearchParams();

  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!data) return;

    reset({
      ...data,
      family_residency_abroad: data.family_residency_abroad?.toString(),
    });
  }, [data, reset])

  const { 
    mutate: changeParentsInfo,
    isPending: parentsInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeParentsInfo();

  const onSubmit = (data) => {
    changeParentsInfo(data)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.relatives.parents_status_heading.title")}
        subtitle={t("application-steps:forms.relatives.parents_status_heading.subtitle")}
      />

    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {isLoading ? (
        <ParentsCurrentStatusSkeleton />
      ) : (
        <ParentsCurrentStatusInputs register={register} errors={errors} control={control} />
      )}

      <FormNavigationButtons
        isLoading={isLoading || parentsInfoIsLoading}
        data={data}
        onPrevious={() => setParam("relatives_step", "guardian")}
        onNext={() => setParam("step", "medical")}
      />
    </form>
    </div>
  )
}

export default ParentsCurrentStatusForm
