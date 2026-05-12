import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { Label } from '@/components/ui/Form/Label';
import Heading from '@/components/ui/Heading';
import React, { Activity, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import EgInputs from '../components/eg-inputs';
import ExInputs from '../components/ex-inputs';
import { objectToFormData } from '@/utils/api.utils';
import { validationSchema as EgValidationSchema } from '../components/eg-inputs/validation';
import { validationSchema as ExValidationSchema } from '../components/ex-inputs/validation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { Button } from '@/components/ui/Button';
import FormNavigationButtons from '../../../components/FormNavigationButtons';
import { useHandleMutationResponse } from '../../../../hooks';
import { splitPhoneNumber } from '@/validation/rules';
import { useChangeGuardianInfo } from '@/hooks/api/regestration.hooks';
import InputsSkeleton from '../components/InputsSkeleton';

const GuardianInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { setParam } = useURLSearchParams();
  const [isEgyptian, setIsEgyptian] = useState(true)
  const [dialCode, setDialCode] = useState("EG");

  const form = useForm({
    mode: "onChange",
    resolver: async (formValues, context, options) => {
      const requiredFiles = !!data; // or however you detect existing data
      
      const schema =
        isEgyptian
          ? EgValidationSchema({ requiredFiles: !requiredFiles })
          : ExValidationSchema({ requiredFiles: !requiredFiles });

      return yupResolver(schema)(formValues, context, options);
    },
  });

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = form;
  
  useEffect(() => {
    if (!data) return;

    const { dialCode: dl, phoneNumber } = splitPhoneNumber(data.mobile_number)

    setIsEgyptian(data.is_egyptian)
    setDialCode(dl)

    reset({
      ...data,
      mobile_number: phoneNumber,
    })
  }, [data, reset]);

  const { 
    mutate: changeRelativesInfo,
    isPending: relativesInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangeGuardianInfo(isEgyptian);

  const onSubmit = (data) => {
    const formData = objectToFormData(data);

    if (isEgyptian) {
      formData.set("nationality", "EG");
    }

    if (formData.has("mobile_number")) {
      const fullNumber = `${dialCode} ${formData.get("mobile_number")}`;
      formData.set("mobile_number", fullNumber);
    }
    
    changeRelativesInfo(formData)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.relatives.relative_heading.title")}
        subtitle={t("application-steps:forms.relatives.relative_heading.subtitle")}
      />

      <div className="space-y-2">
        <Label text={t("fields:guardian_is_egyptian.label")} required />

        <div className="w-fit flex items-center gap-5">
          <RadioButton
            label={t("yes")}
            checked={isEgyptian === true}
            onChange={() => setIsEgyptian(true)}
          />
          <RadioButton
            label={t("no")}
            checked={isEgyptian === false}
            onChange={() => setIsEgyptian(false)}
          />
        </div>

        <DescriptionText
          description={t("fields:guardian_is_egyptian.description")}
        />
      </div>

      {isLoading ? (
        <InputsSkeleton />
      ) : (
        <>
          <Activity mode={isEgyptian ? "visible": "hidden"}>
            <EgInputs register={register} errors={errors} control={control} dialCode={dialCode} setDialCode={setDialCode} />
          </Activity>
          <Activity mode={!isEgyptian ? "visible": "hidden"}>
            <ExInputs register={register} errors={errors} control={control} dialCode={dialCode} setDialCode={setDialCode} />
          </Activity>
        </>
      )}

      <FormNavigationButtons
        isLoading={isLoading || relativesInfoIsLoading}
        data={data}
        onPrevious={() => setParam("step", "academic")}
        onNext={() => setParam("relatives_step", "parents_status")}
      />
    </form>
  )
}

export default GuardianInputs
