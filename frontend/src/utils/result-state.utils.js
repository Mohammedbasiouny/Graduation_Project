import i18n from "@/i18n";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getResultState = (result) => {
  const map = {
    accepted: {
      text: i18n.t("fields:result_options.accepted"),
      color: "text-green-600",
      type: "success",
      icon: CheckCircle
    },
    pending: {
      text: i18n.t("fields:result_options.pending"),
      color: "text-yellow-600",
      type: "warning",
      icon: Clock
    },
    rejected: {
      text: i18n.t("fields:result_options.rejected"),
      color: "text-red-600",
      type: "error",
      icon: XCircle
    }
  };

  return map[result] || map.rejected;
};