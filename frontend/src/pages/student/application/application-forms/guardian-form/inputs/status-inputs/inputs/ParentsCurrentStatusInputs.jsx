import React from 'react'
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/Form/Label'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import { RadioButton } from '@/components/ui/Form/Choice'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { Button } from '@/components/ui/Button';
import { Controller } from 'react-hook-form';
import ErrorText from '@/components/ui/Form/ErrorText';
import { PARENTS_STATUS_OPTIONS } from '@/constants';

const ParentsCurrentStatusInputs = ({ register, errors, control }) => {

  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20">
      {/* Housing Type */}
      <div className="space-y-2">
        <Label text={t("fields:parents_status.label")} required />
        <Controller
          name='parents_status'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={PARENTS_STATUS_OPTIONS()}
              value={value}
              placeholder={t("fields:parents_status.placeholder")}
              onChange={onChange}
              error={errors?.parents_status?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:parents_status.description")}
        />
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <Label text={t("fields:family_residency_abroad.label")} required />

        <div className="w-fit flex items-center gap-5">
          <RadioButton {...register("family_residency_abroad")} label={t("yes")} value="true" />
          <RadioButton {...register("family_residency_abroad")} label={t("no")} value="false" />
        </div>
        <div>
          <ErrorText error={errors?.family_residency_abroad?.message} />
        </div>
        <DescriptionText
          description={t("fields:family_residency_abroad.description")}
        />
      </div>
    </div>
  )
}

export default ParentsCurrentStatusInputs
