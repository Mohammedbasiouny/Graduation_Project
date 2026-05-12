import * as Yup from "yup";
import i18n from "@/i18n";

export const select = ({ required = true } = {}) => {
  let schema = Yup.mixed()
    .transform((val) => {
      if (!val) return undefined; // 👈 important
      if (typeof val === "object") return val.value ?? undefined;
      return val;
    });

  if (required) {
    schema = schema.required(() => i18n.t(`validations:choose_one_option`));
  }

  return schema;
};