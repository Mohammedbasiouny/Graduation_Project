import Heading from "@/components/ui/Heading";
import RedirectText from "@/components/ui/RedirectText";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "./form";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading
        title={t("auth:forgot_pass_page.title")}
        subtitle={t("auth:forgot_pass_page.subtitle")}
      />

      <ForgotPasswordForm />

      <RedirectText 
        text={t("auth:login_page.go_to_signup_link")}
        linkText={t("buttons:signup")}
        linkTo="/auth/choose-university" 
        centerText
      />
    </>
  );
};

export default ForgotPasswordPage;
