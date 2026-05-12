import { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import SignupForm from "./form";
import RedirectText from "@/components/ui/RedirectText";
import { useNavigate } from "react-router";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";
import { Alert } from "@/components/ui/Alert";

import hu_logo from "@/assets/logos/HU_for_light_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_light_screen.png";
import hitu_logo from "@/assets/logos/HITU_for_light_screen.png";

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getParam } = useURLSearchParams();

  const [university, setUniversity] = useState("");

  // Pick correct logo based on value
  const getLogo = (key) => {
    switch (key) {
      case "hu":
        return hu_logo;
      case "hnu":
        return hnu_logo;
      case "hitu":
        return hitu_logo;
      default:
        return null;
    }
  };

  useEffect(() => {
    const allowedValues = ["hu", "hnu", "hitu"];
    const universityValue = getParam("university");

    if (!universityValue || !allowedValues.includes(universityValue)) {
      showToast("warning", t("auth:choose_uni_page.warning_message"));
      navigate("/auth/choose-university", { replace: true });
      return;
    }

    setUniversity(universityValue);
  }, [t, getParam, navigate]);

  const universityLogo = getLogo(university);

  return (
    <>
      <Heading
        title={t("auth:signup_page.title")}
        subtitle={t("auth:signup_page.subtitle")}
      />

      {university && (
        <Alert
          type="warning"
          dismissible={false}
          title={t(`universities.${university}`)}
        >
          <div className="flex gap-3">
            {universityLogo && (
              <img
                src={universityLogo}
                alt={`${university} Logo`}
                className="w-[100px] h-auto object-contain"
              />
            )}
            <p className="text-sm sm:text-base md:text-lg font-medium text-(--gray-dark)">
              {t("auth:signup_page.messages.selected_university", {
                university: t(`universities.${university}`),
              })}
            </p>
          </div>
        </Alert>
      )}

      <SignupForm university={university} />

      <RedirectText
        text={t("auth:signup_page.go_to_login_link")}
        linkText={t("buttons:login")}
        linkTo="/auth/login"
        centerText
      />
    </>
  );
};

export default SignupPage;
