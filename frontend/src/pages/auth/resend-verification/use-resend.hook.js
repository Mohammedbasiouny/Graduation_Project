import { useState } from "react";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";
import { guestAuthService } from "@/services/auth";

export const useResendVerification = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearParams } = useURLSearchParams();

  const openPopup = (userEmail) => {
    setEmail(userEmail);
    setOpen(true);
  };

  const closePopup = () => {
    clearParams()
    setOpen(false);
  }

  const resendVerificationEmail = async (email = "") => {
    if (!email) return;
    setLoading(true);

    try {
      const response = await guestAuthService.resendVerification({ email });
      const status = response?.status;

      if (status === 200) {
        showToast("success", t("auth:resend_verification.messages.sent_successfully"));
      } else if (status === 404) {
        showToast("error", t("auth:resend_verification.messages.email_not_found"));
      } else if (status === 409) {
        showToast("warning", t("auth:resend_verification.messages.already_verified"));
      } else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      showToast("error", t("messages:network_error"));
    } finally {
      setLoading(false);
    }
    return true;
  };

  return {
    open,
    email,
    loading,
    openPopup,
    closePopup,
    resendVerificationEmail,
  };
};
