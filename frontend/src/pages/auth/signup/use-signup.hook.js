import { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyFormServerErrors } from "@/utils/api.utils";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { guestAuthService } from "@/services/auth";

export const useSignup = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (data, setError) => {
    setLoading(true);
    try {
      const response = await guestAuthService.signup(data);
      const status = response?.status;

      if (status === 201) {
        showToast("success", t("auth:signup_page.messages.account_created_successfully"));
        setTimeout(() => navigate('/auth/login'), 1000);
      } else if (status === 409) {
        showToast("error", t("auth:signup_page.messages.account_creation_failed"));
        applyFormServerErrors({"email": [t("validations:email.exists")]}, setError)
      } else if (status === 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(response.data.errors, setError);
      } else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};
