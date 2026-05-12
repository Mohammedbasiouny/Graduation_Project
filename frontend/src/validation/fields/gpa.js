import * as Yup from "yup";
import i18n from "@/i18n";

export const gpa = ({ required = true }) => {
  let schema = Yup.number()
    .typeError(() => i18n.t("validations:gpa.invalid"))
    .min(0, () => i18n.t("validations:gpa.min"))
    .max(4, () => i18n.t("validations:gpa.max"))
    .transform((value, originalValue) => {
      const parsed = parseFloat(originalValue);
      return isNaN(parsed) ? undefined : parsed;
    });

  if (required) {
    schema = schema.required(() => i18n.t("validations:gpa.required"));
  }

  return schema;
};
