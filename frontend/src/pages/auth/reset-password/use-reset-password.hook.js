import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { applyFormServerErrors } from "@/utils/api.utils";
import { guestAuthService } from "@/services/auth";

export const useResetPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async (data, setError) => {
    setLoading(true);
    try {
      data.otp = Number(data.otp);

      const response = await guestAuthService.resetPassword(data);
      const status = response?.status;

      if (status === 200) {
        showToast("success", t("auth:reset_pass_page.messages.password_reset_successfully"));
        setTimeout(() => navigate("/auth/"), 500);
      } 
      else if (status === 400) {
        showToast("error", t("auth:otp_page.messages.expired"));
        setTimeout(() => navigate(`/auth/forgot-password?email=${data.email}`), 500);
      } 
      else if (status === 404) {
        showToast("error", t("auth:forgot_pass_page.messages.email_not_found"));
        setTimeout(() => navigate("/auth/forgot-password"), 500);
      } 
      else if (status === 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(response.data.errors, setError);
      } 
      else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};
