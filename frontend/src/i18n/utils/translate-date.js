import { AR_DIGITS } from "./constants";
import i18n from "../index";

export const translateDate = (value, lang = i18n.language) => {
  try {
    if (!value) return "";

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) return value;

    // Split into parts
    const [year, month, day] = value.split("-");

    const formattedDate = `${day}-${month}-${year}`;

    if (lang === "ar") {
      return formattedDate.replace(/\d/g, (d) => AR_DIGITS[d]);
    }

    return formattedDate;
  } catch (error) {
    console.warn("Failed to translate date:", value, error);
    return value?.toString() || "";
  }
};