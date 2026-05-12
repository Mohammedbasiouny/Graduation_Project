import * as Yup from "yup";
import i18n from "@/i18n";

export const confirmPassword = ({ required = true, refField } = {}) => {
  let schema = Yup.string();

  if (required) {
    schema = schema
      .required(() => i18n.t("validations:confirm_password.required"))
      .oneOf([Yup.ref(refField)], () => i18n.t("validations:confirm_password.match"));
  }

  return schema;
};
