import React from 'react'
import CountCard from '@/components/ui/CountCard'
import { translateNumber } from '@/i18n/utils'
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n/use-language.hook';
import { GraduationCap, Map, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

const EgyptOverview = ({ statistics }) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage()
  const navigate = useNavigate();

  return (
    <>
      <div
        className="inline-flex hover:scale-105 duration-150 ease-in-out cursor-pointer w-full h-full"
        onClick={() => navigate("governorates")}
      >
        <CountCard
          label={t("egypt:administrative_overview.governorates.label")}
          subtext={t("egypt:administrative_overview.governorates.subtext")}
          value={translateNumber(statistics.governorates, currentLang)}
          icon={MapPin}
          variant="gray"
        />
      </div>

      <div
        className="inline-flex hover:scale-105 duration-150 ease-in-out cursor-pointer w-full h-full"
        onClick={() => navigate("educational-departments")}
      >
        <CountCard
          label={t("egypt:administrative_overview.educational_directorates.label")}
          subtext={t("egypt:administrative_overview.educational_directorates.subtext")}
          value={translateNumber(statistics.educational_departments, currentLang)}
          icon={GraduationCap}
          variant="gray"
        />
      </div>

      <div
        className="inline-flex hover:scale-105 duration-150 ease-in-out cursor-pointer w-full h-full"
        onClick={() => navigate("police-stations")}
      >
        <CountCard
          label={t("egypt:administrative_overview.police_departments.label")}
          subtext={t("egypt:administrative_overview.police_departments.subtext")}
          value={translateNumber(statistics.police_stations, currentLang)}
          icon={Shield}
          variant="gray"
        />
      </div>

      <div
        className="inline-flex hover:scale-105 duration-150 ease-in-out cursor-pointer w-full h-full"
        onClick={() => navigate("cities")}
      >
      <CountCard
        label={t("egypt:administrative_overview.areas.label")}
        subtext={t("egypt:administrative_overview.areas.subtext")}
        value={translateNumber(statistics.cities, currentLang)}
        icon={Map}
        variant="gray"
      />
      </div>
    </>
  )
}

export default EgyptOverview
