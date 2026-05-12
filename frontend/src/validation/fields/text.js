import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const text = ({
  required = true,
  min = 2,
  max = 200,
  allowSpaces = true, // allow spaces in text
  numbersOnly = false, // ✅ new option
} = {}) => {
  let schema = Yup.string().max(max, () =>
    i18n.t("validations:text.max", { max: translateNumber(max, i18n.language, false) })
  );

  // Determine pattern based on options
  let pattern;
  if (numbersOnly) {
    pattern = /^[0-9]*$/; // only digits
  } else {
    pattern = allowSpaces
      ? /^[\p{L}\p{N}\s.,'’\-؟،!]*$/u // letters, numbers, punctuation, spaces
      : /^[\p{L}\p{N}.,'’\-؟،!]*$/u; // letters, numbers, punctuation, no spaces
  }

  if (required) {
    schema = schema
      .matches(pattern, () => i18n.t("validations:text.invalid"))
      .min(min, () =>
        i18n.t("validations:text.min", { min: translateNumber(min, i18n.language, false) })
      )
      .required(() => i18n.t("validations:text.required"));
  } else {
    schema = schema.matches(pattern, () => i18n.t("validations:text.invalid"));
  }

  return schema;
};