import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema as validationSchemaFunction } from './validation';
import { objectToFormData } from '@/utils/api.utils';
import PersonalInfoSection from './personal-info-section';
import { splitPhoneNumber } from '@/validation/rules';
import PersonalInfoSkeletion from './personal-info-section/Skeletion';
import { useChangePersonalInfo } from '@/hooks/api/regestration.hooks';
import { formatToDateOnly } from '@/utils/format-date-and-time.utils';
import { useHandleMutationResponse } from '../../../hooks';
import UploadFilesSection from '../../components/UploadFilesSection';
import FormNavigationButtons from '../../components/FormNavigationButtons';
import ContactSectionSkeletion from '../contact-section/Skeletion';
import ContactSection from '../contact-section';

const ExInputs = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { setParam } = useURLSearchParams();

  const navigate = useNavigate();

  const [dialCode, setDialCode] = useState("+20");

  const [validationSchema, setValidationSchema] = useState(validationSchemaFunction({ requiredFiles: true }))

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      passport_issuing_country: "FR",
      nationality: "FR",
    }
  });

  useEffect(() => {
    if (!data) return;

    setValidationSchema(validationSchemaFunction({ requiredFiles: false }))

    const { dialCode, phoneNumber } = splitPhoneNumber(data.mobile_number)

    setDialCode(dialCode)

    reset({
      ...data,
      mobile_number: phoneNumber,
      date_of_birth: formatToDateOnly(data.date_of_birth),
    });
  }, [data, reset])

  const { 
    mutate: changePersonalInfo,
    isPending: personalInfoIsLoading,
    isSuccess,
    isError,
    error,
    reset: resetMutation
  } = useChangePersonalInfo(false);

  const onSubmit = (data) => {
    const formData = objectToFormData(data);
    if (formData.has("mobile_number")) {
      const fullNumber = `${dialCode} ${formData.get("mobile_number")}`;
      formData.set("mobile_number", fullNumber);
    }
    formData.delete("is_egyptian")
    changePersonalInfo(formData)
  };

  useHandleMutationResponse({ isSuccess, isError, error, setError, resetMutation })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.personal.heading.title")}
          subtitle={t("application-steps:forms.personal.heading.subtitle")}
        />
        {isLoading ? (
          <PersonalInfoSkeletion />
        ) : (
          <PersonalInfoSection register={register} errors={errors} control={control} />
        )}
      </div>
      

      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.contact.heading.title")}
          subtitle={t("application-steps:forms.contact.heading.subtitle")}
        />
        {isLoading ? (
          <ContactSectionSkeletion />
        ) : (
          <ContactSection register={register} errors={errors} dialCode={dialCode} setDialCode={setDialCode}  />
        )}
      </div>

      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <UploadFilesSection
        register={register}
        errors={errors}
        fields={[
          {
            name: "personal_image",
            translationKey: "personal_image",
          },
          {
            name: "passport_image",
            translationKey: "passport_image",
          }
        ]}
      />

      <FormNavigationButtons
        isLoading={isLoading || personalInfoIsLoading}
        data={data}
        onPrevious={() => navigate(`/student/choose-nationality`)}
        onNext={() => setParam("step", "residence")}
      />
    </form>
  )
}

export default ExInputs
