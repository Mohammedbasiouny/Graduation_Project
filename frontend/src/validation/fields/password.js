import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const password = ({
  required = true,
  minLength = 8,
  specialChars = false,
  upperCase = false,
  lowerCase = false,
  numbers = false,
} = {}) => {
  let schema = Yup.string().trim();

  if (required) {
    schema = schema.required(() => i18n.t("validations:password.required"));
  }

  if (minLength) {
    schema = schema.min(
      minLength,
      () => i18n.t("validations:password.minLength", { min: translateNumber(minLength, i18n.language, false) })
    );
  }

  if (specialChars) {
    schema = schema.matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      () => i18n.t("validations:password.specialChar")
    );
  }

  if (upperCase) {
    schema = schema.matches(
      /[A-Z]/,
      () => i18n.t("validations:password.upperCase")
    );
  }

  if (lowerCase) {
    schema = schema.matches(
      /[a-z]/,
      () => i18n.t("validations:password.lowerCase")
    );
  }

  if (numbers) {
    schema = schema.matches(
      /[0-9]/,
      () => i18n.t("validations:password.number")
    );
  }

  return schema;
};
