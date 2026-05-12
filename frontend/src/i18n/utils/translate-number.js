import { AR_DIGITS } from "./constants";
import i18n from "../index";

export const translateNumber = (value, lang = i18n.language, formatted = false) => {
  try {
    if (!value) return "";

    const strValue = value.toString();

    if (formatted) {
      const numberValue = /^0\d+/.test(strValue) ? strValue : Number(strValue);
      if (isNaN(numberValue)) return strValue;

      const formatter = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US");
      return formatter.format(numberValue);
    }

    if (lang === "ar") {
      return strValue.replace(/\d/g, (d) => AR_DIGITS[d]).replace(".", "٫");
    }

    return strValue;
  } catch (error) {
    console.warn("Failed to format number:", value, error);
    return value?.toString() || "";
  }
};