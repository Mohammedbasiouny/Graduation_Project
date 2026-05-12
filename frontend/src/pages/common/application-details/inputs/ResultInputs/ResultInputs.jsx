import Field from "@/components/ui/Form/Field";
import { Label } from "@/components/ui/Form/Label";
import { SelectBox } from "@/components/ui/Form/SelectBox";
import { Textarea } from "@/components/ui/Form/Textarea";
import { STUDENT_RESULT_OPTIONS } from "@/constants";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ResultInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label text={t("fields:security_result_inquiry.label")} required />
        <Controller
          name='security_result_inquiry'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:security_result_inquiry.placeholder")}
              options={STUDENT_RESULT_OPTIONS()}
              error={errors?.security_result_inquiry?.message}
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label text={t("fields:candidate_for_final_acceptance.label")} required />
        <Controller
          name='candidate_for_final_acceptance'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:candidate_for_final_acceptance.placeholder")}
              options={STUDENT_RESULT_OPTIONS()}
              error={errors?.candidate_for_final_acceptance?.message}
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label text={t("fields:final_acceptance.label")} required />
        <Controller
          name='final_acceptance'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBox
              value={value}
              onChange={onChange}
              placeholder={t("fields:final_acceptance.placeholder")}
              options={STUDENT_RESULT_OPTIONS()}
              error={errors?.final_acceptance?.message}
            />
          )}
        />
      </div>

      <Field className="space-y-2">
        <Label text={t("fields:message_to_student.label")} required />
        <Textarea 
          type="number"
          {...register("message_to_student")} 
          placeholder={t("fields:message_to_student.placeholder")}
          error={errors?.message_to_student?.message}
          rows={3}
        />
      </Field>
    </>
  );
};

export default ResultInputs;
