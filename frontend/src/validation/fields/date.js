import * as Yup from "yup";
import i18n from "@/i18n";
import { translateDate } from "@/i18n/utils";

export const date = ({ required = true, start = null, end = null, formateDate = true } = {}) => {
  let schema = Yup.date()
    .typeError(() => i18n.t("validations:date.invalid")) // handles invalid date strings
    .nullable();

  if (start) {
    schema = schema.min(start, () =>
      i18n.t("validations:date.min", {
        date: translateDate(start, i18n.language, formateDate),
      })
    );
  }

  if (end) {
    schema = schema.max(end, () =>
      i18n.t("validations:date.max", {
        date: translateDate(end, i18n.language, formateDate),
      })
    );
  }

  if (required) {
    schema = schema.required(() => i18n.t("validations:date.required"));
  }

  return schema;
};
