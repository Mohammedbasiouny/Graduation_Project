import useCountUp from "@/hooks/use-count-up.hook";
import { translateNumber } from "@/i18n/utils";
import { Building, Home, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";



const StatsCards = () => {
  const { t } = useTranslation();

  const statsData = [
    {
      label: t("home:hero_section.stats.buildings"),
      value: translateNumber(useCountUp({ start: 3, end: 10, duration: 1000 })),
      icon: Building,
    },
    {
      label: t("home:hero_section.stats.rooms"),
      value: translateNumber(useCountUp({ start: 900, end: 1197, duration: 1000 })),
      icon: Home,
    },
    {
      label: t("home:hero_section.stats.students"),
      value: translateNumber(useCountUp({ start: 3500, end: 3907, duration: 1000 })),
      icon: Users,
    },
  ];
  return (
    <div className="lg:col-span-2 w-full flex flex-col md:flex-row items-center justify-center gap-[5%]">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <React.Fragment key={index}>
            {/* Card */}
            <div className="w-fit flex flex-col items-center justify-center p-6">
              <Icon className={`w-10 h-10 mb-2`} />
              <span className="text-gray-500 text-lg text-center">{stat.label}</span>
              <span className="text-4xl font-bold text-gray-900 mt-2">+{stat.value}</span>
            </div>

            {/* Separator */}
            {index < statsData.length - 1 && (
              <div className="w-[80%] h-0.5 md:w-0.5 md:h-32 bg-gray-300 rounded-full"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StatsCards;
