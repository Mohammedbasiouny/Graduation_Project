import { useTranslation } from "react-i18next";
import hu_logo from "@/assets/logos/HU_for_dark_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_dark_screen.png";
import ict_logo from "@/assets/logos/CICT.png";
import hitu_logo from "@/assets/logos/HITU_for_dark_screen.png";
import white_UDORM_logo from "@/assets/logos/white_UDORM_logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-(--navy-main) text-white p-5 sm:px-[90px] sm:py-[45px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center rtl:md:text-right ltr:md:text-left">

        {/* Column 1: Logo and title */}
        <div className="flex flex-col items-center">
          <img
            src={white_UDORM_logo}
            alt="white UDORM logo"
            className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
          />
          <p className="text-[16px] sm:text-[22px] font-bold text-center">{t("web_site_name")}</p>
        </div>

        {/* Column 2: University Dorms */}
        <div className="text-[14px] sm:text-[16px]">
          <h3 className="text-(--gold-main) font-bold mb-2.5">
            {t("footer:sections.dorms.title")}
          </h3>
          <ul className="space-y-2">
            <li>{t("footer:sections.dorms.about")}</li>
            <li>{t("footer:sections.dorms.goals")}</li>
            <li>{t("footer:sections.dorms.rules")}</li>
            <li>{t("footer:sections.dorms.student_guide")}</li>
            <li>{t("footer:sections.dorms.results")}</li>
          </ul>
        </div>

        {/* Column 3: Application and Procedures */}
        <div className="text-[14px] sm:text-[16px]">
          <h3 className="text-(--gold-main) font-bold mb-2.5">
            {t("footer:sections.application.title")}
          </h3>
          <ul className="space-y-2">
            <li>{t("footer:sections.application.steps")}</li>
            <li>{t("footer:sections.application.new_account")}</li>
            <li>{t("footer:sections.application.login")}</li>
            <li>{t("footer:sections.application.data_entry")}</li>
            <li>{t("footer:sections.application.result")}</li>
          </ul>
        </div>

        {/* Column 4: Help and Contact */}
        <div className="text-[14px] sm:text-[16px]">
          <h3 className="text-(--gold-main) font-bold mb-[10px">
            {t("footer:sections.help.title")}
          </h3>
          <ul className="space-y-2">
            <li>{t("footer:sections.help.faq")}</li>
            <li>{t("footer:sections.help.tech_support")}</li>
            <li>{t("footer:sections.help.contact")}</li>
            <li>{t("footer:sections.help.map")}</li>
            <li>{t("footer:sections.help.universities")}</li>
          </ul>
        </div>
      </div>

      {/* Bottom Description + Logos */}
      <div className="mt-10 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-5 text-center rtl:md:text-right ltr:md:text-left">
        <p className="w-full text-[14px] sm:text-[16px] leading-relaxed">
          {t("footer:description")}
        </p>
        <div className="flex items-center justify-center gap-5">
          <img src={ict_logo} alt="ICT Center" className="h-[50px]" />
          <img src={hu_logo} alt="Capital University" className="h-[50px]" />
          <img src={hnu_logo} alt="Capital International University" className="h-[50px]" />
          <img src={hitu_logo} alt="Capital International Technological University" className="h-[50px]" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
