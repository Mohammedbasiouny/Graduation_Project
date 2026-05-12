import { Popup } from "@/components/ui/Popup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useResendVerification } from "./use-resend.hook";

const ResendVerificationPopup = ({ 
  open = false, 
  email = "", 
  closePopup = null, 
}) => {
  const { t } = useTranslation();
  const { loading, resendVerificationEmail } = useResendVerification();
  return (
    <Popup
      isOpen={open}
      closeModal={closePopup}
      title={t("auth:resend_verification.title")}
      description={t("auth:resend_verification.description", { email })}
    >
      <p className="text-sm text-gray-700 mb-4 text-center ltr:sm:text-left rtl:sm:text-right">
        {t("auth:resend_verification.instruction")}
      </p>

      <div className="flex justify-end gap-2 mt-3">
        <Button 
          onClick={closePopup}
          variant="cancel"
          size="md"
          fullWidth
        >
          {t("buttons:close")}
        </Button>

        <Button
          onClick={async () => {
            const success = await resendVerificationEmail(email);
            if (success && closePopup) {
              closePopup();
            }
          }}
          variant="secondary"
          size="md"
          fullWidth
          isLoading={loading}
        >
          {loading ? t("buttons:isLoading") : t("buttons:resend")}
        </Button>
      </div>
    </Popup>
  );
};

export default ResendVerificationPopup;
