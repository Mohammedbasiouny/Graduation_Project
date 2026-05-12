import i18n from "@/i18n";
import { Check, CircleQuestionMark, X } from "lucide-react";

export const getVisibilityStatus = (status) => {
  const isVisible = String(status) === "true";

  let variant;
  switch (isVisible) {
    case true:
      variant = "success";
      break;
    case false:
      variant = "warning";
      break;
    default:
      variant = "default";
  }

  let Icon;
  switch (isVisible) {
    case true:
      Icon = Check;
      break;
    case false:
      Icon = X;
      break;
    default:
      Icon = CircleQuestionMark;
  }

  const label = i18n.t(`selection_status.${isVisible}`)

  return { isVisible, label, variant, Icon };
};
