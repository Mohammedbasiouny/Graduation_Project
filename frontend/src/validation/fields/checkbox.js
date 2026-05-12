import * as Yup from "yup";
import i18n from "@/i18n";

export const checkbox = ({ required = false } = {}) => {
  let schema = Yup.boolean()
    .transform((value, originalValue) => {
      // Fix: checkbox sometimes returns ""
      if (originalValue === "" || originalValue == null) return false;

      // Handle common cases
      if (originalValue === "true" || originalValue === 1 || originalValue === "1") return true;
      if (originalValue === "false" || originalValue === 0 || originalValue === "0") return false;

      return value;
    })
    .default(false);

  if (required) {
    schema = schema.oneOf([true], () =>
      i18n.t("validations:must_be_checked")
    );
  }

  return schema;
};
