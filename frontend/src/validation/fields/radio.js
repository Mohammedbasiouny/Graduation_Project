import * as Yup from "yup";
import i18n from "@/i18n";

export const radio = ({ type = "boolean", required = true } = {}) => {
  let schema =
    type === "string"
      ? Yup.string()
      : type === "number"
      ? Yup.number()
      : Yup.boolean();
  
  if (required) {
    schema = schema.required(() =>
      i18n.t("validations:choose_one_option")
    );
  }

  return schema;
};
