import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useDepartmentsOptions } from '@/hooks/options/departments-options.hooks';
import { useFacultiesOptions } from '@/hooks/options/faculties-options.hooks';
import { useAuthStore } from '@/store/use-auth.store';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const AcademiciInfoSection = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const { options: collegesOptions, isLoading: collegeIsLoading } = useFacultiesOptions({ is_visible: true, university: user.university });
  const selectedCollege = watch("college");

  const { options: departmentsOptions, isLoading: departmentIsLoading } = useDepartmentsOptions({ 
    faculty_id: selectedCollege, 
    enabled: !!selectedCollege, 
    is_visible: true 
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div className="space-y-2">
        <Label text={t("fields:college.label")} required />
        {collegeIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='college'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:college.placeholder")}
                options={collegesOptions}
                error={errors?.college?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:college.description")}
        />
      </div>
      <div className="space-y-2">
        <Label text={t("fields:department_or_program.label")} required />
        {departmentIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='department_or_program'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:department_or_program.placeholder")}
                options={departmentsOptions}
                error={errors?.department_or_program?.message}
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:department_or_program.description")}
        />
      </div>
      <Field className="space-y-2">
        <Label text={t("fields:admission_year.label")} required />
        <Input
          type={"number"}
          placeholder={t("fields:admission_year.placeholder")}
          {...register("admission_year")} 
          error={errors?.admission_year?.message}
        />
        <DescriptionText
          description={t("fields:admission_year.description")}
        />
      </Field>
    </div>
  )
}

export default AcademiciInfoSection
