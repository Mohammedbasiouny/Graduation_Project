import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import OtpForm from './form';
import { useNavigate } from 'react-router';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { isValidEmail } from '@/validation/rules';
import { showToast } from '@/utils/toast.util';

const CheckOtpPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { getParam } = useURLSearchParams();

  const [email, setEmail] = useState("")

  useEffect(() => {
    const emailValue = getParam("email")
    // Redirect to choose university page if no university selected
    if (!emailValue || !isValidEmail(emailValue)) {
      showToast("warning", t("auth:forgot_pass_page.messages.email_invalid_retype"))
      navigate("/auth/forgot-password", { replace: true });
      return;
    }
    setEmail(emailValue)
  }, [getParam, navigate, t]);

  return (
    <>
      <Heading
        title={t("auth:otp_page.title")}
        subtitle={t("auth:otp_page.subtitle")}
      />

      <OtpForm email={email} />
    </>
  );
}

export default CheckOtpPage
