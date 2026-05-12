import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import { useMemo } from 'react';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { MEAL_CATEGORY_OPTIONS } from '@/constants';
import { Textarea } from '@/components/ui/Form/Textarea';
import { Checkbox } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';

const MealInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* University */}
      <Field className="space-y-2">
        <Label
          text={t(`fields:meal_name.label`)}
          required
        />
        <Input
          type={"text"}
          {...register("name")}
          placeholder={t(`fields:meal_name.placeholder`)}
          error={errors?.name?.message}
        />
      </Field>

      <div className="space-y-2">
        <Label text={t("fields:meal_category.label")} required />
        <Controller
          name='category'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:meal_category.placeholder")}
              options={MEAL_CATEGORY_OPTIONS()}
              error={errors?.category?.message}
            />
          )}
        />
      </div>

      <Field className="space-y-2">
        <Label text={t("fields:description.label")} />
        <Textarea 
          type="number"
          {...register("description")} 
          placeholder={t("fields:description.placeholder")}
          error={errors?.description?.message}
          rows={3}
        />
      </Field>

      <div className='space-y-2'>
        <Checkbox
          label={t("fields:meal_is_active.label")}
          {...register("is_active")}
        />
        <DescriptionText description={t("fields:meal_is_active.description")} />
      </div>
    </>
  );
};

export default MealInputs;
