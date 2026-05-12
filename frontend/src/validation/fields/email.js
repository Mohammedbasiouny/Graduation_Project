import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const email = ({ required = true, max = 254 } = {}) => {
  let schema = Yup.string()
    .trim()
    .email(() => i18n.t("validations:email.invalid"))
    .max(max, () => i18n.t("validations:email.max", { max: translateNumber(max, i18n.language, false) }))
    .transform(value => value?.toLowerCase());

  if (required) {
    schema = schema.required(() => i18n.t("validations:email.required"));
  }

  return schema;
};