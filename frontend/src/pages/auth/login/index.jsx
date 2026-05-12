import Heading from "@/components/ui/Heading";
import LoginForm from "./form";
import RedirectText from "@/components/ui/RedirectText";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading
        title={t("auth:login_page.title")}
        subtitle={t("auth:login_page.subtitle")}
      />

      <LoginForm />

      <RedirectText 
        text={t("auth:login_page.go_to_signup_link")}
        linkText={t("buttons:signup")}
        linkTo="/auth/choose-university" 
        centerText
      />
    </>
  );
};

export default LoginPage;
