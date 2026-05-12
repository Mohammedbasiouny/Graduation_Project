import i18n from "@/i18n";
import { Check, X } from "lucide-react";

/**
 * Returns display info for account blocked status
 * @param {boolean|string} blocked - true if blocked, false if unblocked
 */
export const getAccountBlockedStatus = (end_date) => {
  const isBlocked = end_date !== null;

  const variant = isBlocked ? "default" : "info"; // red if blocked, green if unblocked
  const Icon = isBlocked ? X : Check;
  const label = i18n.t(`account:blocked.${isBlocked}`); // keys: account:status.true / false

  return { isBlocked, label, variant, Icon };
};