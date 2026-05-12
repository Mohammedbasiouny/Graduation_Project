import * as Yup from "yup";
import i18n from "@/i18n";
import { translateTime } from "@/i18n/utils";

export const time = ({ required = true, start = null, end = null, formateTime = true } = {}) => {
  let schema = Yup.string()
    .trim()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, () => i18n.t("validations:time.invalid")); // 24-hour HH:mm

  if (start) {
    schema = schema.test(
      "min-time",
      () =>
        i18n.t("validations:time.min", {
          time: translateTime(start, i18n.language, formateTime),
        }),
      (value) => {
        if (!value) return true;
        return value >= start;
      }
    );
  }

  if (end) {
    schema = schema.test(
      "max-time",
      () =>
        i18n.t("validations:time.max", {
          time: translateTime(end, i18n.language, formateTime),
        }),
      (value) => {
        if (!value) return true;
        return value <= end;
      }
    );
  }

  if (required) {
    schema = schema.required(() => i18n.t("validations:time.required"));
  }

  return schema;
};
