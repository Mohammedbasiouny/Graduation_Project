import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';
import { Controller } from 'react-hook-form';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useFacultiesOptions } from '@/hooks/options/faculties-options.hooks';
import { useEffect, useState } from 'react';
import { UNIVERSITIES_OPTIONS } from '@/constants';

const DepartmentInputs = ({ uni, register, errors, control }) => {
  const { t } = useTranslation();
  const [selectedUni, setSelectedUni] = useState("");

  const { options: collegesOptions, isLoading: collegeIsLoading } = useFacultiesOptions({ university: selectedUni, enabled: !!selectedUni });

  useEffect(() => {
    setSelectedUni(uni)
  }, [uni])

  return (
      <>
      {/* University */}
      <div className="space-y-2">
        <Label text={t("fields:university.label")} required />
        <SelectBox
          value={selectedUni}
          onChange={setSelectedUni}
          placeholder={t("fields:university.placeholder")}
          options={UNIVERSITIES_OPTIONS(["hu", "hnu", "hitu"])}
          error={errors?.university?.message}
        />
      </div>

      <div className="space-y-2">
        <Label text={t("fields:college.label")} required />
        {collegeIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='faculty_id'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:college.placeholder")}
                options={collegesOptions}
                error={errors?.faculty_id?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:college.description")}
        />
      </div>

        <Field className="space-y-2">
          <Label text={t("fields:department_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:department_name.placeholder")}
            error={errors?.name?.message}
          />
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

export default DepartmentInputs
