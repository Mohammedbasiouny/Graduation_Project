import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { InputSkeleton } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { Textarea } from '@/components/ui/Form/Textarea';
import { useCitiesOptions } from '@/hooks/options/cities-options.hooks';
import { usePoliceStationsOptions } from '@/hooks/options/police-stations-options.hooks';
import { useGovernoratesOptions } from '@/hooks/options/use-governorates-options.hook';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ResidenceInfoSection = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();
  
  const selectedGov = watch("governorate");
  const selectedPolice = watch("district_or_center");

  const { options: govsOptions, isLoading: govIsLoading } = useGovernoratesOptions({ is_visible: true });

  const { options: policeOptions, isLoading: policeIsLoading } = usePoliceStationsOptions({ 
    governorate_id: selectedGov, 
    enabled: !!selectedGov, 
    is_visible: true,
  });
  const { options: citiesOptions, isLoading: citiesIsLoading } = useCitiesOptions({ 
    governorate_id: selectedGov, 
    police_station_id: selectedPolice, 
    enabled: !!selectedGov && !!selectedPolice, 
    is_visible: true,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <Field className="space-y-2">
        <Label text={t("fields:governorate_of_residence.label")} required />
        {govIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='governorate'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:governorate_of_residence.placeholder")}
                options={govsOptions}
                error={errors?.governorate?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:governorate_of_residence.description")}
        />
      </Field>
      <Field className="space-y-2">
        <Label text={t("fields:police_station_or_center.label")} required />
        {policeIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='district_or_center'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:police_station_or_center.placeholder")}
                options={policeOptions}
                error={errors?.district_or_center?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:police_station_or_center.description")}
        />
      </Field>
      <Field className="space-y-2">
        <Label text={t("fields:city_sheikhdom_or_village.label")} required />
        {citiesIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='city_or_village'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:city_sheikhdom_or_village.placeholder")}
                options={citiesOptions}
                error={errors?.city_or_village?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:city_sheikhdom_or_village.description")}
        />
      </Field>

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
