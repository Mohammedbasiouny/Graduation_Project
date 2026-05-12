import { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import ResetPasswordForm from "./form";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { isValidEmail, isValidOtp } from "@/validation/rules";

const ResetPasswordPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { getParam } = useURLSearchParams();

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  useEffect(() => {
    const emailValue = getParam("email")
    const otpValue = getParam("otp")

    // Redirect to choose university page if no university selected
    if (!emailValue || !isValidEmail(emailValue)) {
      showToast("warning", t("auth:forgot_pass_page.messages.email_invalid_retype"))
      navigate("/auth/forgot-password", { replace: true });
      return;
    }
    if (!otpValue || !isValidOtp(otpValue, 6)) {
      showToast("warning", t("auth:otp_page.messages.otp_invalid_retype"))
      navigate(`/auth/check-otp?email=${emailValue}`, { replace: true });
      return;
    }

    setEmail(emailValue)
    setOtp(otpValue)
  }, [getParam, navigate, t]);

  return (
    <>
      <Heading
        title={t("auth:reset_pass_page.title")}
        subtitle={t("auth:reset_pass_page.subtitle")}
      />

      <ResetPasswordForm email={email} otp={otp} />
    </>
  );
};

export default ResetPasswordPage;
