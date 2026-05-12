import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import { useMemo } from 'react';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { STUDENT_TYPE_OPTIONS, UNIVERSITIES_OPTIONS } from '@/constants';

const ApplicationDateInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

  const inputs = useMemo(
    () => [
      { field: "who_can_apply", name: "name",      type: "text", required: true },
      { field: "start_date",    name: "startAt", type: "datetime-local", required: true },
      { field: "end_date",    name: "endAt", type: "datetime-local", required: true },
    ],
    []
  );

  return (
    <>
      {/* University */}
      <div className="space-y-2">
        <Label text={t("fields:university.label")} required />
        <Controller
          name='university'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:university.placeholder")}
              options={UNIVERSITIES_OPTIONS()}
              error={errors?.university?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label text={t("fields:student_type.label")} required />
        <Controller
          name='studentType'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:student_type.placeholder")}
              options={STUDENT_TYPE_OPTIONS()}
              error={errors?.studentType?.message}
            />
          )}
        />
      </div>

      {/* Dynamic Inputs */}
      {inputs.map(({ name, field, type, required }) => (
        <Field key={name} className="space-y-2">
          <Label
            text={t(`fields:${field}.label`)}
            required={required}
          />
          <Input
            type={type}
            {...register(name)}
            placeholder={t(`fields:${field}.placeholder`)}
            error={errors?.[name]?.message}
          />
        </Field>
      ))}
    </>
  );
};

export default ApplicationDateInputs;
