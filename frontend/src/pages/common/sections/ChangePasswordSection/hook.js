import { userAuthService } from "@/services/auth";
import { applyFormServerErrors } from "@/utils/api.utils";
import { showToast } from "@/utils/toast.util";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useChangePassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const changePassword = async (data, setError) => {
    setLoading(true);
    try {
      const response = await userAuthService.changePassword(data);
      const status = response?.status;

      if (status === 200) {
        showToast("success", t("account:messages.password_change_success"));
      } 
      else if (status === 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(response.data.errors, setError);
      } 
      else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Change Password error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};
