import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { Textarea } from '@/components/ui/Form/Textarea';
import { useCountriesStore } from '@/store/use-countries.store';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ResidenceInfoSection = ({ register, errors, control }) => {
  const { t } = useTranslation();
  const { getCountryOptions } = useCountriesStore();
  const countryOptions = getCountryOptions("code", "name", true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div className="space-y-2">
        <Label text={t("fields:country_of_residence.label")} required />
        <Controller
          name='country'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:country.placeholder")}
              options={countryOptions}
              error={errors?.country?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:country_of_residence.description")}
        />
      </div>

      <Field className="space-y-2 col-span-1 md:col-span-2">
        <Label text={t("fields:detailed_address.label")} required />
        <Textarea
          rows={3}
          placeholder={t("fields:detailed_address.placeholder")}
          {...register("detailed_address")} 
          error={errors?.detailed_address?.message}
        />
        <DescriptionText
          description={t("fields:detailed_address.description")}
        />
      </Field>
    </div>
  )
}

export default ResidenceInfoSection
