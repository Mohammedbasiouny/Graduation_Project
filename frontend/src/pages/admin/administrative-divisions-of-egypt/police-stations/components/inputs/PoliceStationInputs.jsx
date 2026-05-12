import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';
import { useGovernoratesOptions } from '@/hooks/options/use-governorates-options.hook';
import { Controller } from 'react-hook-form';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useParams } from 'react-router';
import { useEffect } from 'react';

const PoliceStationInputs = ({ register, errors, control, setValue = null }) => {
  const { t } = useTranslation();
  const { options, isLoading } = useGovernoratesOptions();
  
  const { gov } = useParams();

  useEffect(() => {
    if (!isLoading && gov && setValue) {
      setValue("governorate_id", gov);
    }
  }, [isLoading, gov, setValue]);
  
  return (
      <>
        <Field className="space-y-2">
          <Label text={t("fields:police_station_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:police_station_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:governorate.label")} required />
          {isLoading ? (
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
                  options={options}
                  error={errors?.governorate_id?.message}
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

        <div className='space-y-2'>
          <Checkbox
            label={t("fields:acceptance_status.label")}
            {...register("acceptance_status")}
          />
          <DescriptionText description={t("fields:acceptance_status.placeholder")} />
        </div>
      </>
  )
}

export default PoliceStationInputs
