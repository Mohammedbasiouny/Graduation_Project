import { adminUserService, userAuthService } from "@/services/auth";
import { applyFormServerErrors } from "@/utils/api.utils";
import { showToast } from "@/utils/toast.util";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useChangeEmail = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const changeEmail = async (data, setError, id = null) => {
    setLoading(true);

    try {
      let response = null;

      if (id == null) {
        response = await userAuthService.changeMyEmail(data);
      } else {
        response = await adminUserService.changeUserEmail(id, data);
      }

      const status = response?.status;

      if (status === 200) {
        showToast(
          "success",
          t("account:messages.email_change_verification_sent")
        );
      } else if (status === 404) {
        showToast("error", t("account:messages.email_not_found"));
      } else if (status === 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(response.data.errors, setError);
      } else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Change Email error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { changeEmail, loading };
};