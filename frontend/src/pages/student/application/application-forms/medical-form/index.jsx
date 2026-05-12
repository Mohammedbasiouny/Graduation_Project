import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { useParams } from 'react-router';
import Inputs from './inputs';
import { validationSchema as chronicDiseasesSchema } from './inputs/chronic-diseases/validation';
import { validationSchema as behavioralSocialAspectsSchema } from './inputs/behavioral-socialaspects/validation';
import { validationSchema as treatmentsSchema } from './inputs/treatments/validation';
import { validationSchema as specialneedsSchema } from './inputs/special-needs/validation';
import { validationSchema as psychologicalSchema } from './inputs/mood-psychological-assessment/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useChangeMedicalInfo } from '@/hooks/api/regestration.hooks';
import { useHandleMutationResponse } from '../../hooks';
import FormNavigationButtons from '../components/FormNavigationButtons';

const MedicalForm = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { setParam } = useURLSearchParams();
  const { nationality } = useParams();

  const combinedSchema = Yup.object().shape({
    ...chronicDiseasesSchema.fields,
    ...behavioralSocialAspectsSchema.fields,
    ...treatmentsSchema.fields,
    ...specialneedsSchema.fields,
    ...psychologicalSchema.fields,
  });

  const { register, handleSubmit, formState: { errors }, control, watch, setError, reset } = useForm({
    resolver: yupResolver(combinedSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!data) return;
    
    reset(data);
  }, [data, reset]);

  const { 
    mutate: changeMedicalInfo,
    isPending: medicalInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeMedicalInfo();

  const onSubmit = (data) => {
    changeMedicalInfo(data)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="info"
          title={t("application-steps:forms.medical.error_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.medical.error_note.description")}
          </p>
        </Alert>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <Inputs register={register} errors={errors} control={control} watch={watch} />

        <FormNavigationButtons
          isLoading={isLoading || medicalInfoIsLoading}
          data={data}
          onPrevious={() => setParam("step", nationality == "egyptian" ? "relatives" : "academic")}
          onNext={() => setParam("step", "housing")}
        />
      </form>
    </div>
  )
}

export default MedicalForm
