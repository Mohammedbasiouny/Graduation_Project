import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';
import { Controller } from 'react-hook-form';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { COLLEGE_LOCATION_OPTIONS, UNIVERSITIES_OPTIONS } from '@/constants';

const CollegeInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

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
                options={UNIVERSITIES_OPTIONS(["hu", "hnu", "hitu"])}
                error={errors?.university?.message}
              />
            )}
          />
      </div>

        <Field className="space-y-2">
          <Label text={t("fields:college_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:college_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <div className="space-y-2">
          <Label text={t("fields:college_is_off_campus.label")} required />
            <Controller
              name='is_off_campus'
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  value={value}
                  onChange={onChange}
                  placeholder={t("fields:college_is_off_campus.placeholder")}
                  options={COLLEGE_LOCATION_OPTIONS(["true", "false"])}
                  error={errors?.is_off_campus?.message}
                />
              )}
            />
        </div>

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

export default CollegeInputs
