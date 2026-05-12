import React from 'react'
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/Form/Label'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import { RadioButton } from '@/components/ui/Form/Choice'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { Button } from '@/components/ui/Button';
import { Controller } from 'react-hook-form';
import ErrorText from '@/components/ui/Form/ErrorText';
import { HOUSING_OPTIONS } from '@/constants';
import { useAuthStore } from '@/store/use-auth.store';

const HousingInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20">
      {/* Housing Type */}
      <div className="space-y-2">
        <Label text={t("fields:housing_type.label")} required />
        <Controller
          name='housing_type'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={HOUSING_OPTIONS(user?.university === "hu" ? [] : ["premium"])}
              value={value}
              placeholder={t("fields:housing_type.placeholder")}
              onChange={onChange}
              error={errors?.housing_type?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:housing_type.description")}
        />
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <Label text={t("fields:meals.label")} required />

        <div className="w-fit flex items-center gap-5">
          <RadioButton {...register("meals")} label={t("yes")} value="true" />
          <RadioButton {...register("meals")} label={t("no")}  value="false" />
        </div>
        <div>
          <ErrorText error={errors?.meals?.message} />
        </div>
        <DescriptionText
          description={t("fields:meals.description")}
        />
      </div>
    </div>
  )
}

export default HousingInputs
