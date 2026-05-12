import { useNavigate } from "react-router";
import Heading from "@/components/ui/Heading";
import RedirectText from "@/components/ui/RedirectText";
import hu_logo from "@/assets/logos/HU_for_light_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_light_screen.png";
import hitu_logo from "@/assets/logos/HITU_for_light_screen.png";
import UniversityCard from "@/components/ui/UniversityCard";
import { useTranslation } from "react-i18next";

const ChooseUniversityPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSelectUniversity = (universityName) => {
    navigate(`/auth/signup?university=${encodeURIComponent(universityName)}`);
  };

  return (
    <>
      <Heading
        title={t("auth:choose_uni_page.title")}
        subtitle={t("auth:choose_uni_page.subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UniversityCard
          title={t("universities.hu")}
          className="cursor-pointer"
          image={hu_logo}
          onClick={() => handleSelectUniversity("hu")}
        />

        <UniversityCard
          title={t("universities.hnu")}
          className="cursor-pointer"
          image={hnu_logo}
          onClick={() => handleSelectUniversity("hnu")}
        />

        <UniversityCard
          title={t("universities.hitu")}
          image={hitu_logo}
          className="md:col-span-2 cursor-pointer"
          onClick={() =>
            handleSelectUniversity("hitu")
          }
        />
      </div>

      <RedirectText 
        text={t("auth:signup_page.go_to_login_link")}
        linkText={t("buttons:login")}
        linkTo="/auth/login" 
        centerText
      />
    </>
  );
};

export default ChooseUniversityPage;
