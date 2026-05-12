import Heading from "@/components/ui/Heading";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";
import CountCard from "@/components/ui/CountCard";
import SystemStatus from "./components/SystemStatus";
import ResidentsKpi from "./components/ResidentsKpi";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import ManageresidentsCards from "./components/ManageresidentsCards";

const ManageAccommodationOverviewPage = () => {
  const { t } = useTranslation();

  const [statistics, setStatistics] = useState({
    accepted: 10,
    face: 5,
    rooms: 5,
  });

  const completion = Math.round((statistics.rooms / statistics.accepted) * 100);
  const hasGap =
    statistics.accepted !== statistics.face ||
    statistics.accepted !== statistics.rooms;

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-10">
      {/* HEADER */}
      <Heading
        title={t("manage-residents:main_heading.title")}
        subtitle={t("manage-residents:main_heading.subtitle")}
      />
      <SystemStatus statistics={statistics} completion={completion} hasGap={hasGap} />

      <ResidentsKpi statistics={statistics} completion={completion} />

      {/* ⚠️ INSIGHT PANEL */}
      {hasGap && (
        <p className="text-sm sm:text-base text-center text-yellow-700">
          {t("manage-residents:fast_comparison.note")}
        </p>
      )}

      <ManageresidentsCards />
    </div>
  );
};

export default ManageAccommodationOverviewPage;