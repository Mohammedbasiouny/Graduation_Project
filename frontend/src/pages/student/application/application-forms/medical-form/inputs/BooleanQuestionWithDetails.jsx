import { Controller } from "react-hook-form";
import { RadioButton } from "@/components/ui/Form/Choice";
import DescriptionText from "@/components/ui/Form/DescriptionText";
import ErrorText from "@/components/ui/Form/ErrorText";
import Field from "@/components/ui/Form/Field";
import { Label } from "@/components/ui/Form/Label";
import { Textarea } from "@/components/ui/Form/Textarea";
import { useTranslation } from "react-i18next";

const BooleanQuestionWithDetails = ({
  name,
  register,
  control,
  watch,
  errors,
  translationPath,
  withDetails = true,
}) => {
  const { t } = useTranslation();
  const value = watch(name);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Boolean (Yes / No) */}
      <div className="space-y-2">
        <Label
          text={t(`${translationPath}.${name}.label`)}
          required
        />

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className="flex gap-5">
              <RadioButton
                label={t("yes")}
                checked={field.value === true}
                onChange={() => field.onChange(true)}
              />
              <RadioButton
                label={t("no")}
                checked={field.value === false}
                onChange={() => field.onChange(false)}
              />
            </div>
          )}
        />

        <DescriptionText
          description={t(`${translationPath}.${name}.description`)}
        />
        <div>
          <ErrorText error={errors?.[name]?.message} />
        </div>
      </div>

      {/* Details */}
      {withDetails && (
        <Field className="space-y-2 md:col-span-2">
          <Label
            text={t(`${translationPath}.${name}_details.label`)}
            required={value === true}
          />

          <Textarea
            {...register(`${name}_details`)}
            rows={2}
            disabled={value !== true}
            placeholder={t(
              `${translationPath}.${name}_details.placeholder`
            )}
            error={
              value === true
                ? errors?.[`${name}_details`]?.message
                : ""
            }
          />

          <DescriptionText
            description={t(
              `${translationPath}.${name}_details.description`
            )}
          />
        </Field>
      )}
    </div>
  );
};

export default BooleanQuestionWithDetails;
