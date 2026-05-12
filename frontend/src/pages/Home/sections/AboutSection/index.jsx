import React from "react";
import { useTranslation } from "react-i18next";
import Heading from "@/components/ui/Heading";
import { Quote, Sparkles, Target } from "lucide-react";
import { MiniBadge } from "./MiniBadge";
import { InfoCard } from "./InfoCard";
import { useLanguage } from "@/i18n/use-language.hook";
const AboutSection = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  return (
    <section
      id="about-us"
      className="w-full mx-auto flex flex-col items-center px-4 sm:px-6 py-16 bg-linear-to-b from-white to-gray-50"
    >
      {/* Heading */}
      <Heading
        title={t("home:about_section.heading.title")}
        subtitle={t("home:about_section.heading.subtitle")}
      />

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 flex flex-col gap-8">
        {/* About Text (Simple + Elegant) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left highlight */}
          <div className="lg:col-span-2 rounded-3xl bg-(--navy-deep) text-white p-7 sm:p-9 shadow-sm">
            <MiniBadge>{t("home:about_section.badges.about")}</MiniBadge>

            <h3 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
              {t("home:about_section.side_card.title")}
              <span className="block text-(--gold-light)">
                {t("home:about_section.side_card.highlight")}
              </span>
            </h3>

            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">
              {t("home:about_section.side_card.description")}
            </p>
          </div>

          {/* Right text */}
          <div className="flex gap-5 lg:col-span-3 rounded-3xl bg-gray-50 border border-gray-100 p-7 sm:p-9">
            {/* First Quote icon */}
            <div className={`self-start`}>
              <Quote className={`transform -scale-y-100 ${isArabic ? "" : "transform -scale-x-100"}`} size={20} />
            </div>

            <div className="flex flex-col gap-6 mt">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {t("home:about_section.content.about_p1")}
              </p>

              <div className="w-full h-px bg-gray-200" />

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {t("home:about_section.content.about_p2")}
              </p>
            </div>

            {/* Second Quote icon with flipped direction based on language */}
            <div className={`self-end`}>
              <Quote className={`${isArabic ? "transform -scale-x-100" : ""}`} size={20} />
            </div>
          </div>
        </div>

        {/* Vision + Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard
            variant="primary"
            icon={<Sparkles size={24} />}
            title={t("home:about_section.vision.title")}
            description={t("home:about_section.vision.description")}
          />

          <InfoCard
            variant="dark"
            icon={<Target size={24} />}
            title={t("home:about_section.mission.title")}
            description={t("home:about_section.mission.description")}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
