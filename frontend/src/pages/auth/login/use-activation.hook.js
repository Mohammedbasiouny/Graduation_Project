import { useEffect } from "react";
import { showToast } from "@/utils/toast.util";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from "react-i18next";

export const useActivation = ({ openPopup }) => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  
  useEffect(() => {
    const accountStatus = getParam("activated");
    if (!accountStatus) return;

    switch (accountStatus) {
      case "success":
        showToast("success", t("auth:login_page.messages.activation_success"));
        break;

      case "already":
        showToast("warning", t("auth:login_page.messages.activation_already"));
        break;

      case "expired": {
        showToast("warning", t("auth:login_page.messages.activation_expired"));
        const emailFromQuery = getParam("email");
        if (emailFromQuery) openPopup(emailFromQuery);
        break;
      }

      case "invalid":
        showToast("error", t("auth:login_page.messages.activation_invalid"));
        break;

      default:
        break;
    }
    
  }, [getParam, t]);
};
