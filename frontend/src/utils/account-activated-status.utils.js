import i18n from "@/i18n";
import { Check, X, CircleQuestionMark } from "lucide-react";

/**
 * Returns display info for account active status
 * @param {boolean|string} status - true/false or "true"/"false"
 */
export const getAccountActivatedStatus = (status) => {
  const isActive = String(status) === "true";

  let variant;
  switch (isActive) {
    case true:
      variant = "success"; // green for active
      break;
    case false:
      variant = "error"; // red for inactive
      break;
    default:
      variant = "default"; // gray for unknown
  }

  let Icon;
  switch (isActive) {
    case true:
      Icon = Check;
      break;
    case false:
      Icon = X;
      break;
    default:
      Icon = CircleQuestionMark;
  }

  const label = i18n.t(`account:is_active.${isActive}`); // i18n keys: account:status.true / false

  return { isActive, label, variant, Icon };
};