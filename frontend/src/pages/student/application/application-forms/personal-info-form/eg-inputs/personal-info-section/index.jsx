import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import ErrorText from '@/components/ui/Form/ErrorText';
import Field from '@/components/ui/Form/Field';
import { Input } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useCountriesStore } from '@/store/use-countries.store';
import { isBornInEgypt } from '@/validation/rules';
import { Activity } from 'react'
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const PersonalInfoSection = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();
  const { getCountryOptions } = useCountriesStore();
  const nationalId = watch("national_id") || "";
  const countryOptions = getCountryOptions("code", "name", true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* SSN */}
      <Field className="space-y-2">
        <Label text={t("fields:ssn.label")} required />
        <Input
          {...register("national_id")} 
          error={errors?.national_id?.message}
          placeholder={t("fields:ssn.placeholder")}
        />
        <DescriptionText
          description={t("fields:ssn.description")}
        />
      </Field>

      {/* Full Name */}
      <Field className="space-y-2">
        <Label text={t("fields:full_name.label")} required />
        <Input
          placeholder={t("fields:full_name.placeholder")}
          {...register("full_name")} 
          error={errors?.full_name?.message}
        />
        <DescriptionText
          description={t("fields:full_name.description")}
        />
      </Field>

      {/* Religion */}
      <div className="space-y-2">
        <Label text={t("fields:religion.label")} required />
        <div className='w-fit flex gap-10 mt-auto'>
          <RadioButton 
            {...register("religion")} 
            value="muslim"
            label={t("religion.muslim")} 
          />
          <RadioButton 
            {...register("religion")} 
            value="christian"
            label={t("religion.christian")} 
          />
        </div>
        <div>
          <ErrorText error={errors?.religion?.message} />
        </div>
        <DescriptionText
          description={t("fields:religion.description")}
        />
      </div>

      {/* Birth Country & City (Conditional) */}
      <Activity
        mode={
          nationalId.length >= 9 && !isBornInEgypt(nationalId)
            ? "visible"
            : "hidden"
        }
      >
        <div className="space-y-2">
          <Label text={t("fields:birth_country.label")} required />
          <Controller
            name='birth_country'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:birth_country.placeholder")}
                options={countryOptions}
                error={errors?.birth_country?.message}
              />
            )}
          />
          <DescriptionText
            description={t("fields:birth_country.description")}
          />
        </div>
      </Activity>

      <Field className="space-y-2">
        <Label text={t("fields:birth_city.label")} required />
        <Input
          placeholder={t("fields:birth_city.placeholder")}
          {...register("birth_city")} 
          error={errors?.birth_city?.message}
        />
        <DescriptionText
          description={t("fields:birth_city.description")}
        />
      </Field>
    </div>
  )
}

export default PersonalInfoSection
