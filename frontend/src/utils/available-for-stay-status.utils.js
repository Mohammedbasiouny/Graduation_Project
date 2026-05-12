import i18n from "@/i18n";
import { Check, CircleQuestionMark, X } from "lucide-react";

export const getAvailableForStayStatus = (status) => {
  const isAvailableForStay = String(status) === "true";

  let variant;
  switch (isAvailableForStay) {
    case true:
      variant = "success";
      break;
    case false:
      variant = "error";
      break;
    default:
      variant = "default";
  }

  let Icon;
  switch (isAvailableForStay) {
    case true:
      Icon = Check;
      break;
    case false:
      Icon = X;
      break;
    default:
      Icon = CircleQuestionMark;
  }

  const label = i18n.t(`buildings:is_available_for_stay.${isAvailableForStay}`);

  return { isAvailableForStay, label, variant, Icon };
};
