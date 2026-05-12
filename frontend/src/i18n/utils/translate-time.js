import { AR_DIGITS } from "./constants";
import i18n from "../index";

export const translateTime = (value, lang = i18n.language, formatted = true) => {
  try {
    if (!value) return "";

    // Validate 24-hour format HH:mm
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(value)) return value;

    if (!formatted) {
      return lang === "ar" ? value.replace(/\d/g, (d) => AR_DIGITS[d]) : value;
    } else {
      const [hourStr, minute] = value.split(":");
      let hour = parseInt(hourStr, 10);
      let period = "AM";

      // Convert to 12-hour format
      if (hour === 0) {
        hour = 12;
        period = "AM";
      } else if (hour === 12) {
        period = "PM";
      } else if (hour > 12) {
        hour -= 12;
        period = "PM";
      }

      let formattedTime = `${hour.toString().padStart(2, "0")}:${minute} ${period}`;

      // Arabic digits conversion
      if (lang === "ar") {
        formattedTime = formattedTime.replace(/\d/g, (d) => AR_DIGITS[d]);
        // Optional: translate AM/PM to Arabic
        formattedTime = formattedTime.replace("AM", "ص").replace("PM", "م");
      }

      return formattedTime
    }
  } catch (error) {
    console.warn("Failed to translate time:", value, error);
    return value?.toString() || "";
  }
};