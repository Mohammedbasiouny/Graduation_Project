import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';
import { Controller } from 'react-hook-form';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useGovernoratesOptions } from '@/hooks/options/use-governorates-options.hook';
import { usePoliceStationsOptions } from '@/hooks/options/police-stations-options.hooks';
import { useParams } from 'react-router';
import { useEffect } from 'react';

const CityInputs = ({ register, errors, control, watch, setValue = null }) => {
  const { t } = useTranslation();
  const { options: govsOptions, isLoading: govIsLoading } = useGovernoratesOptions();
  const selectedGov = watch("governorate_id");
  const { options: policeOptions, isLoading: policeIsLoading } = usePoliceStationsOptions({ governorate_id: selectedGov });

  const { gov, police } = useParams();

  useEffect(() => {
    if (!govIsLoading && !policeIsLoading && setValue) {
      setValue("governorate_id", gov);
      setValue("police_station_id", police);
    }
  }, [govIsLoading, policeIsLoading, gov, police, setValue]);

  return (
      <>
        <Field className="space-y-2">
          <Label text={t("fields:city_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:city_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:governorate.label")} required />
          {govIsLoading ? (
            <InputSkeleton />
          ) : (
            <Controller
              name='governorate_id'
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  value={value}
                  onChange={onChange}
                  placeholder={t("fields:governorate.placeholder")}
                  options={govsOptions}
                  error={errors?.governorate_id?.message}
                />
              )}
            />
          )}
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:police_station.label")} required />
          {policeIsLoading ? (
            <InputSkeleton />
          ) : (
            <Controller
              name='police_station_id'
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  value={value}
                  onChange={onChange}
                  placeholder={t("fields:police_station.placeholder")}
                  options={policeOptions}
                  error={errors?.police_station_id?.message}
                />
              )}
            />
          )}
        </Field>

        <div className='space-y-2'>
          <Checkbox
            label={t("fields:is_visible.label")}
            {...register("is_visible")}
          />
          <DescriptionText description={t("fields:is_visible.placeholder")} />
        </div>
      </>
  )
}

export default CityInputs
