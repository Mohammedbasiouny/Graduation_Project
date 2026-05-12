import React from 'react'
import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import { useTranslation } from 'react-i18next'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import FileUpload from '@/components/ui/Form/FileUpload'
import { useCountriesStore } from '@/store/use-countries.store'
import { Controller } from 'react-hook-form'
import Heading from '@/components/ui/Heading'
import UploadFilesSection from '../../../../components/UploadFilesSection'


const ExInputs = ({ register, errors, control, dialCode, setDialCode}) => {
  const { t } = useTranslation();
  const { getCountryOptions } = useCountriesStore();
  const countryOptions = getCountryOptions("code", "name", true);
  const dialCodeOptions = getCountryOptions("dial_code", "dial_code", true);

  return (
    <div className='w-full space-y-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <Field className="space-y-2">
          <Label text={t("fields:identity_number.label")} required />
          <Input
            {...register("identity_number")} 
            error={errors?.identity_number?.message}
            placeholder={t("fields:identity_number.placeholder")}
          />
          <DescriptionText
            description={t("fields:identity_number.description")}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:full_name.label")} required />
          <Input
            {...register("full_name")} 
            error={errors?.full_name?.message}
            placeholder={t("fields:full_name.placeholder")}
          />
          <DescriptionText
            description={t("fields:full_name.description")}
          />
        </Field>

        <div className="space-y-2">
          <Label text={t("fields:nationality.label")} required />
          <Controller
            name='nationality'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                options={countryOptions}
                value={value}
                onChange={onChange}
                placeholder={t("fields:nationality.placeholder")}
                error={errors?.nationality?.message}
              />
            )}
          />
          <DescriptionText
            description={t("fields:nationality.description")}
          />
        </div>

        <Field className="space-y-2">
          <Label text={t("fields:job_title.label")} required />
          <Input
            {...register("job_title")} 
            error={errors?.job_title?.message}
            placeholder={t("fields:job_title.placeholder")}
          />
          <DescriptionText
            description={t("fields:job_title.description")}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:relationship.label")} required />
          <Input
            {...register("relationship")} 
            error={errors?.relationship?.message}
            placeholder={t("fields:relationship.placeholder")}
          />
          <DescriptionText
            description={t("fields:relationship.description")}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:mobile_number.label")} required />
          <div className='flex gap-2'>
            <div className='min-w-35'>
              <SelectBox
                value={dialCode}
                onChange={setDialCode}
                options={dialCodeOptions}
              />
            </div>
            <Input
              placeholder={t("fields:mobile_number.placeholder")}
              {...register("mobile_number")} 
              error={errors?.mobile_number?.message}
            />
          </div>
          <DescriptionText
            description={t("fields:mobile_number.description")}
          />
        </Field>
      </div>


      <hr className='w-full h-0.5 bg-(--gray-light)' />

      <UploadFilesSection
        register={register}
        errors={errors}
        fields={[
          {
            name: "identity_image",
            translationKey: "identity_image",
          }
        ]}
      />
    </div>
  )
}

export default ExInputs
