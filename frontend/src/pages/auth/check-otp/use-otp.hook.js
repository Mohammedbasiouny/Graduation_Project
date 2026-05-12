import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { guestAuthService } from "@/services/auth";

export const useCheckOtp = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkOtp = async (data) => {
    setLoading(true);
    try {
      data.otp = Number(data.otp) 
      const response = await guestAuthService.checkOtp(data);
      const status = response?.status;

      if (status === 200) {
        showToast("success", t("auth:otp_page.messages.verified_successfully"));
        setTimeout(() => navigate(`/auth/reset-password?email=${data.email}&otp=${data.otp}`), 500);
      } 
      else if (status === 400) {
        showToast("error", t("auth:otp_page.messages.expired"));
      } 
      else if (status === 404) {
        showToast("error", t("auth:forgot_pass_page.messages.email_not_found"));
        setTimeout(() => navigate("/auth/forgot-password"), 500);
      } 
      else if (status === 422) {
        showToast("error", t("messages:validation_error"));
      } 
      else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Check OTP error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { checkOtp, loading };
};
