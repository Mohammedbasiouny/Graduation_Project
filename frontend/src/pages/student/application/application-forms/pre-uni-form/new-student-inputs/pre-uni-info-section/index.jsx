import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import ErrorText from '@/components/ui/Form/ErrorText';
import Field from '@/components/ui/Form/Field';
import { Input, InputSkeleton } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useEduDepartmentsOptions } from '@/hooks/options/edu-departments-options.hooks';
import { useGovernoratesOptions } from '@/hooks/options/use-governorates-options.hook';
import { usePreUniQualificationsOptions } from '@/hooks/options/use-pre-uni-qualifications-options.hook';
import { useCountriesStore } from '@/store/use-countries.store';
import { Activity } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const PreUniInfoSection = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();
  const { options: preUniOptions, preUniIsLoading } = usePreUniQualificationsOptions({ is_visible: true });

  const { options: govsOptions, isLoading: govIsLoading } = useGovernoratesOptions({ is_visible: true });

  const selectedGov = watch("governorate");

  const { options: eduDepartmentsOptions, isLoading: eduDepartmentIsLoading } = useEduDepartmentsOptions({ 
    governorate_id: selectedGov, 
    enabled: !!selectedGov, 
    is_visible: true 
  });

  const { getCountryOptions } = useCountriesStore();
  const countryOptions = getCountryOptions("code", "name", true);

  const isInsideEgypt = watch("is_inside_egypt");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div className="space-y-2">
        <Label text={t("fields:certificate_from_egypt.label")} required />
        <div className="w-fit flex items-center gap-5">
          <RadioButton {...register("is_inside_egypt")} label={t("yes")} value="true" />
          <RadioButton {...register("is_inside_egypt")} label={t("no")}  value="false" />
        </div>
        <DescriptionText
          description={t("fields:certificate_from_egypt.description")}
        />
      </div>

      <div className="space-y-2">
        <Label text={t("fields:certificate_type.label")} required />
        {preUniIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='certificate_type'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:certificate_type.placeholder")}
                options={preUniOptions}
                error={errors?.certificate_type?.message}
                returnObject
              />
            )}
          />
        )}
        <DescriptionText
          description={t("fields:certificate_type.description")}
        />
      </div>

      <Field className="space-y-2">
        <Label text={t("fields:total_score.label")} required />
        <Input
          {...register("total_score")}
          type={"text"}
          placeholder={t("fields:total_score.placeholder")}
          error={errors?.total_score?.message}
        />
        <DescriptionText
          description={t("fields:total_score.description")}
        />
      </Field>

      <Field className="space-y-2">
        <Label text={t("fields:percentage.label")} required />
        <Input
          {...register("percentage")}
          type={"text"}
          placeholder={t("fields:percentage.placeholder")}
          error={errors?.percentage?.message}
        />
        <DescriptionText
          description={t("fields:percentage.description")}
        />
      </Field>

      {isInsideEgypt == "true" ? (
        <>
          <div className="space-y-2">
            <Label text={t("fields:administrative_region.label")} required />
            {govIsLoading ? (
              <InputSkeleton />
            ) : (
              <Controller
                name='governorate'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectBox
                    value={value}
                    onChange={onChange}
                    placeholder={t("fields:administrative_region.placeholder")}
                    options={govsOptions}
                    error={errors?.governorate?.message}
                  />
                )}
              />
            )}
            <DescriptionText
              description={t("fields:administrative_region.description")}
            />
          </div>
          <div className="space-y-2">
            <Label text={t("fields:educational_administration.label")} required />
            {eduDepartmentIsLoading ? (
              <InputSkeleton />
            ) : (
              <Controller
                name='educational_administration'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectBox
                    value={value}
                    onChange={onChange}
                    placeholder={t("fields:educational_administration.placeholder")}
                    options={eduDepartmentsOptions}
                    error={errors?.educational_administration?.message}
                  />
                )}
              />
            )}
            <DescriptionText
              description={t("fields:educational_administration.description")}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label text={t("fields:certificate_country.label")} required />
          <Controller
            name='certificate_country'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                value={value}
                onChange={onChange}
                placeholder={t("fields:certificate_country.placeholder")}
                options={countryOptions}
                error={errors?.certificate_country?.message}
              />
            )}
          />
          <DescriptionText
            description={t("fields:certificate_country.description")}
          />
        </div>
      )}
    </div>
  )
}

export default PreUniInfoSection
