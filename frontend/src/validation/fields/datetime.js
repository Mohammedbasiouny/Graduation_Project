import * as Yup from "yup";
import i18n from "@/i18n";
import { translateDate, translateTime } from "@/i18n/utils";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";

export const datetime = ({
  required = true,
  start = null,
  end = null,
} = {}) => {
  let schema = Yup.date()
    .typeError(() => i18n.t("validations:datetime.invalid"))
    .nullable();

  if (start) {
    schema = schema.min(start, () =>
      i18n.t("validations:datetime.min", {
        date: translateDate(formatToDateOnly(start), i18n.language),
        time: translateTime(formatToTimeOnly(start), i18n.language),
      })
    );
  }

  if (end) {
    schema = schema.max(end, () =>
      i18n.t("validations:datetime.max", {
        date: translateDate(formatToDateOnly(end), i18n.language),
        time: translateTime(formatToTimeOnly(end), i18n.language),
      })
    );
  }

  if (required) {
    schema = schema.required(() => i18n.t("validations:datetime.required"));
  }

  return schema;
};