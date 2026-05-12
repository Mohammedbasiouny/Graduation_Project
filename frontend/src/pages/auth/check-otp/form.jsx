import { useState } from 'react';
import OtpInput from '@/components/ui/Form/OtpInput';
import { Label } from '@/components/ui/Form/Label'
import { useTranslation } from 'react-i18next';
import RedirectText from '@/components/ui/RedirectText';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/i18n/use-language.hook';
import { translateNumber } from '@/i18n/utils';
import { useTimer } from '@/hooks/use-timer.hook';
import { useForgotPassword } from '../forgot-password/use-forgot-password.hook';
import ErrorText from '@/components/ui/Form/ErrorText';
import { useCheckOtp } from './use-otp.hook';
import { validateOtp } from '@/validation/rules';

const OtpForm = ({ email = "" }) => {
  const { currentLang } = useLanguage()
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const { timer, isDisabled, resetTimer } = useTimer(120);

  const { forgotPassword, loading: resendLoading } = useForgotPassword();
  const handleResend = async () => {
    await forgotPassword({ email });
    resetTimer();
  };

  const { checkOtp, loading } = useCheckOtp()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateOtp(otp, 6);
    
    if (validationError != null) {
      setOtpError(validationError)
      return;
    } 
    else {
      const payload = { email, otp }
      await checkOtp(payload)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="space-y-2 flex flex-col items-center justify-center">
        <Label text={t("fields:otp.placeholder")} centerText />
        <OtpInput
          length={6}
          onChange={(value) => setOtp(value)}
          error={!!otpError}
        />
        {otpError ? <ErrorText error={otpError} /> : null}
      </div>

      <RedirectText
        text={t("auth:otp_page.go_to_login_link")}
        linkText={t("buttons:login")}
        linkTo="/auth/login"
      />

      <Button variant="secondary" fullWidth size="md" type="submit" isLoading={loading}>
        {loading ? t("buttons:isLoading") : t("auth:otp_page.submit_button")}
      </Button>

      <Button
        variant="cancel"
        fullWidth
        size="md"
        type="button"
        onClick={handleResend}
        disabled={isDisabled || resendLoading || loading}
        isLoading={resendLoading}
      >
        {isDisabled
          ? `${t("auth:otp_page.resend_button")} (${translateNumber(Math.floor(timer / 60)
          .toString()
          .padStart(2, "0"), currentLang)}:${translateNumber((timer % 60).toString().padStart(2, "0"), currentLang)})`
          : (resendLoading ? t("buttons:isLoading") : t("auth:otp_page.resend_button"))}
      </Button>
    </form>
  );
};

export default OtpForm;