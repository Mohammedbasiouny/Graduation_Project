import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { ENROLLMENT_STATUS_OPTIONS, GRADE_OPTIONS, STUDY_LEVEL_OPTIONS, STUDY_SYSTEM_TYPE_OPTIONS } from '@/constants';
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
      <div className="space-y-2">
        <Label text={t("fields:study_level.label")} required />
        <Controller
          name='study_level'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={STUDY_LEVEL_OPTIONS()}
              value={value}
              placeholder={t("fields:study_level.placeholder")}
              onChange={onChange}
              error={errors?.study_level?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:study_level.description")}
        />
      </div>
      <Field className="space-y-2">
        <Label text={t("fields:student_code.label")} />
        <Input
          type={"text"}
          {...register("student_code")}
          placeholder={t("fields:student_code.placeholder")}
          error={errors?.student_code?.message}
        />
        <DescriptionText
          description={t("fields:student_code.description")}
        />
      </Field>
      <div className="space-y-2">
        <Label text={t("fields:study_system_type.label")} required />
        <Controller
          name='study_system_type'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={STUDY_SYSTEM_TYPE_OPTIONS()}
              value={value}
              placeholder={t("fields:study_system_type.placeholder")}
              onChange={onChange}
              error={errors?.study_system_type?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:study_system_type.description")}
        />
      </div>
      <Field className="space-y-2">
        <Label text={t("fields:gpa_or_total_score.label")} required />
        <Input
          {...register("gpa_or_total_score")}
          placeholder={t("fields:gpa_or_total_score.placeholder")}
          error={errors?.gpa_or_total_score?.message}
        />
        <DescriptionText
          description={t("fields:gpa_or_total_score.description")}
        />
      </Field>
      <div className="space-y-2">
        <Label text={t("fields:grade.label")} required />
        <Controller
          name='grade'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={GRADE_OPTIONS()}
              value={value}
              placeholder={t("fields:grade.placeholder")}
              onChange={onChange}
              error={errors?.grade?.message}
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label text={t("fields:enrollment_status.label")} required />
        <Controller
          name='enrollment_status'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              options={ENROLLMENT_STATUS_OPTIONS()}
              value={value}
              placeholder={t("fields:enrollment_status.placeholder")}
              onChange={onChange}
              error={errors?.enrollment_status?.message}
            />
          )}
        />
        <DescriptionText
          description={t("fields:enrollment_status.description")}
        />
      </div>
    </div>
  )
}

export default AcademiciInfoSection
