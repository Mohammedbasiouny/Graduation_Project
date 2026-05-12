import { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyFormServerErrors } from "@/utils/api.utils";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { guestAuthService } from "@/services/auth";

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgotPassword = async (data, setError) => {
    setLoading(true);
    try {
      const response = await guestAuthService.forgotPassword(data);
      const status = response.status;

      if (status === 200) {
        showToast("success", t("auth:forgot_pass_page.messages.otp_sent_successfully"));
        setTimeout(() => navigate(`/auth/check-otp?email=${data.email}`), 500);
      } else if (status === 404) {
        showToast("error", t("auth:forgot_pass_page.messages.email_not_found"));
        applyFormServerErrors({"email": [t("validations:email.not_exists")]}, setError)
      } else if (status === 422) {
        showToast("error", t("messages:validation_error"));
        if (setError) applyFormServerErrors(response.data.errors, setError);
      } else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Forgot Password error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};
