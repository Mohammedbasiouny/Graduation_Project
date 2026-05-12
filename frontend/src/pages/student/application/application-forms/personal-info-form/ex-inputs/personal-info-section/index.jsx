import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import ErrorText from '@/components/ui/Form/ErrorText';
import Field from '@/components/ui/Form/Field';
import { Input } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useCountriesStore } from '@/store/use-countries.store';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const PersonalInfoSection = ({ register, errors, control }) => {
  const { t } = useTranslation();
  const { getCountryOptions } = useCountriesStore();
  const countryOptions = getCountryOptions("code", "name", true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* SSN */}
      <Field className="space-y-2">
        <Label text={t("fields:passport_number.label")} required />
        <Input
          {...register("passport_number")} 
          error={errors?.passport_number?.message}
          placeholder={t("fields:passport_number.placeholder")}
        />
        <DescriptionText
          description={t("fields:passport_number.description")}
        />
      </Field>

      <div className="space-y-2">
        <Label text={t("fields:passport_issuing_country.label")} required />
        <Controller
          name='passport_issuing_country'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:passport_issuing_country.placeholder")}
              options={countryOptions}
              error={errors?.passport_issuing_country?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:passport_issuing_country.description")}
        />
      </div>

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
              value={value}
              onChange={onChange}
              placeholder={t("fields:nationality.placeholder")}
              options={countryOptions}
              error={errors?.nationality?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:nationality.description")}
        />
      </div>

      <Field className="space-y-2 lg:col-span-2">
        <Label text={t("fields:place_of_birth.label")} required />
        <Input
          {...register("place_of_birth")} 
          error={errors?.place_of_birth?.message}
          placeholder={t("fields:place_of_birth.placeholder")}
        />
        <DescriptionText
          description={t("fields:place_of_birth.description")}
        />
      </Field>

      <Field className="space-y-2">
        <Label text={t("fields:date_of_birth.label")} required />
        <Input
          type="date"
          {...register("date_of_birth")} 
          error={errors?.date_of_birth?.message}
          placeholder={t("fields:date_of_birth.placeholder")}
        />
        <DescriptionText
          description={t("fields:date_of_birth.description")}
        />
      </Field>

      <div className="space-y-2">
        <Label text={t("fields:gender.label")} required />
        <div className='w-fit flex gap-10 mt-auto'>
          <RadioButton 
            {...register("gender")} 
            value="male"
            label={t("gender.male")} 
          />
          <RadioButton 
            {...register("gender")} 
            value="female"
            label={t("gender.female")} 
          />
        </div>
        <div>
          <ErrorText error={errors?.gender?.message} />
        </div>
        <DescriptionText
          description={t("fields:gender.description")}
        />
      </div>

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
    </div>
  )
}

export default PersonalInfoSection
