import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const isValidOtp = (otp, length) => {
  if (!otp) return false;

  // Only digits
  if (!/^\d+$/.test(otp)) return false;

  // Must be exactly 6 digits
  if (otp.length !== length) return false;

  return true; // valid
};

export const validateOtp = (otp, length) => {
  if (!otp) return i18n.t("validations:otp.otp_required");

  // Only digits
  if (!/^\d+$/.test(otp)) return i18n.t("validations:otp.otp_numbers_only");

  // Must be exactly 6 digits
  if (otp.length !== length) return i18n.t("validations:otp.otp_must_be_length_digits", { number: translateNumber(length, i18n.language, true) });

  return null; // valid
};
