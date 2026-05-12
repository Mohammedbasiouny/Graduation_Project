import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const name = ({
  required = true,
  spaces = true,
  min = 2,
  max = 50,
} = {}) => {
  let schema = Yup.string()
    .trim()
    .max(max, () => i18n.t("validations:name.max", { max: translateNumber(max, i18n.language, false) }));

  if (required) {
    const regex = spaces
      ? /^[\p{L}\s'-]+$/u
      : /^[\p{L}'-]+$/u;

    schema = schema
      .matches(regex, () => i18n.t("validations:name.invalid"))
      .min(min, () => i18n.t("validations:name.min", { min: translateNumber(min, i18n.language, false) }))
      .required(() => i18n.t("validations:name.required"));
  }

  return schema;
};
