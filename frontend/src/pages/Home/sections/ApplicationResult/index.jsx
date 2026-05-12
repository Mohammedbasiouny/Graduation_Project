import React, { Activity, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import Heading from '@/components/ui/Heading'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ssnValidationSchema, appNumValidationSchema } from './validation'
import { useTranslation } from 'react-i18next'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import { RadioButton } from '@/components/ui/Form/Choice'
import LockedOverlay from '@/components/ui/LockedOverlay'

const ApplicationResult = () => {
  const { t } = useTranslation();
  const [method, setMethod] = useState("national-id");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(method === "national-id" ? ssnValidationSchema : appNumValidationSchema),
    mode: 'onChange',
  });
  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <section 
      id="application-result"
    >
      <form
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center gap-8"
      >
        <Heading
          title={t("home:application_result_section.heading.title")}
          subtitle={t("home:application_result_section.heading.subtitle")}
        />

        <LockedOverlay status={false} message={t("home:application_result_section.warning_result_not_available")}>
          <div className='w-full flex flex-col items-center gap-5'>
            <div className="space-y-2">
              <Label text={t("fields:application_result_method.label")} required />

              <div className="w-full flex max-md:flex-col items-center gap-3">
                <RadioButton
                  label={t("fields:application_result_method.options.national_id")}
                  checked={method === "national-id"}
                  onChange={() => setMethod("national-id")}
                />
                <RadioButton
                  label={t("fields:application_result_method.options.application_number")}
                  checked={method === "application-number"}
                  onChange={() => setMethod("application-number")}
                />
              </div>

              <DescriptionText
                description={t("fields:application_result_method.description")}
              />
            </div>

            {/* Input field */}
            <Activity mode={method === "application-number" ? "visible" : "hidden"}>
              <Field className="w-full space-y-2">
                <Label
                  required
                  size="lg"
                  text={t("fields:application_number.label")}
                />
                <Input
                  {...register('application_number')} 
                  error={errors.application_number?.message}
                  placeholder={t("fields:application_number.placeholder")}
                />
                <DescriptionText description={t("fields:application_number.description")} />
              </Field>
            </Activity>
            <Activity mode={method === "national-id" ? "visible" : "hidden"}>
              <Field className="w-full space-y-2">
                <Label
                  required
                  size="lg"
                  text={t("fields:ssn.label")}
                />
                <Input
                  {...register('ssn')} 
                  error={errors.ssn?.message}
                  placeholder={t("fields:ssn.placeholder")}
                />
                <DescriptionText description={t("fields:ssn.description")} />
              </Field>
            </Activity>

          {/* Button */}
          <div className="flex justify-center sm:justify-start">
            <Button variant="secondary" size="lg">
              {t("home:application_result_section.submit_btn")}
            </Button>
          </div>
          </div>
        </LockedOverlay>
      </form>
    </section>
  )
}

export default ApplicationResult
