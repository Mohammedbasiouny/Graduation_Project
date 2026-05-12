import Field from '@/components/ui/Form/Field'
import { Input, InputSkeleton } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { useMealsOptions } from '@/hooks/options/meals-options.hooks'
import React from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const SlotInputs = ({
  name = "meals",
  index,
  register,
  errors,
  control
}) => {
  const { t } = useTranslation();
  const { options: mealsOptions, isLoading: mealsIsLoading } = useMealsOptions();

  const isArray = index !== undefined && index !== null;

  // 🔥 dynamic path builder (handles both modes)
  const fieldPath = (field) => {
    if (isArray) return `${name}.${index}.${field}`;
    return name ? `${name}.${field}` : field;
  };

  // 🔥 dynamic error getter
  const fieldError = (field) => {
    if (isArray) return errors?.[name]?.[index]?.[field]?.message;
    if (name) return errors?.[name]?.[field]?.message;
    return errors?.[field]?.message;
  };

  return (
    <>

      {/* Meal */}
      <div className="space-y-2">
        <Label text={t("fields:meal.label")} required />
        {mealsIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name={fieldPath("meal_id")}
            control={control}
            render={({ field }) => (
              <SelectBox
                {...field}
                placeholder={t("fields:meal.placeholder")}
                options={mealsOptions}
                error={fieldError("meal_id")}
              />
            )}
          />
        )}
      </div>

      {/* Delivery Start */}
      <Field className="space-y-2">
        <Label text={t("fields:delivery_start_time.label")} required />
        <Input
          type="datetime-local"
          {...register(fieldPath("delivery_start_time"))}
          error={fieldError("delivery_start_time")}
        />
      </Field>

      {/* Delivery End */}
      <Field className="space-y-2">
        <Label text={t("fields:delivery_end_time.label")} required />
        <Input
          type="datetime-local"
          {...register(fieldPath("delivery_end_time"))}
          error={fieldError("delivery_end_time")}
        />
      </Field>

    </>
  )
}

export default SlotInputs;