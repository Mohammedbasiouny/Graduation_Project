import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const number = ({ required = true, min = null, max = null, integer = false } = {}) => {
  let schema = Yup.number()
    .typeError(() => i18n.t("validations:number.invalid"));

  if (integer) {
    schema = schema.integer(() => i18n.t("validations:number.integer"));
  }

  if (min !== null) {
    schema = schema.min(min, () =>
      i18n.t("validations:number.min", { min: translateNumber(min, i18n.language, false) })
    );
  }

  if (max !== null) {
    schema = schema.max(max, () =>
      i18n.t("validations:number.max", { max: translateNumber(max, i18n.language, false) })
    );
  }

  if (required) {
    schema = schema.required(() => i18n.t("validations:number.required"));
  }

  return schema;
};
