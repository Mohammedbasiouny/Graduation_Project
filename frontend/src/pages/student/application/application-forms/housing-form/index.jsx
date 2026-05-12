import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import { Alert } from '@/components/ui/Alert'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './validation';
import HousingInputs from './inputs/HousingInputs';
import { useEffect } from 'react';
import { useChangeHousingInfo } from '@/hooks/api/regestration.hooks';
import HousingInputsSkeleton from './inputs/HousingInputsSkeleton';
import { useNavigate } from 'react-router';
import { useHandleMutationResponse } from '../../hooks';
import FormNavigationButtons from '../components/FormNavigationButtons';

const HousingForm = ({ data = null, isLoading = false }) => {
  const { setParam } = useURLSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!data) return;

    reset({
      ...data,
      meals: data.meals?.toString()
    });
  }, [data, reset])

  const { 
    mutate: changeHousingInfo,
    isPending: housingInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeHousingInfo(false);

  const onSubmit = (data) => {
    changeHousingInfo(data)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="info"
          title={t("application-steps:forms.housing.info_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.housing.info_note.description")}
          </p>
        </Alert>
      </div>

      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.housing.heading.title")}
        subtitle={t("application-steps:forms.housing.heading.subtitle")}
      />

    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {isLoading ? (
        <HousingInputsSkeleton />
      ) : (
        <HousingInputs register={register} errors={errors} control={control} />
      )}

      <FormNavigationButtons
        isLoading={isLoading || housingInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", "medical")}
        onNext={() => navigate(`/student/track-application`)}
        isEnd
      />
    </form>
    </div>
  )
}

export default HousingForm
