import AvailableDates from "./screens/AvailableDates";
import AlertScreen from "@/components/screens/AlertScreen";
import { CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetPeriodStatus } from "../hooks";

export default function ApplicationDatesPage () {
  const { t } = useTranslation();
  const { periodStatus } = useGetPeriodStatus()

  return (
    <div className="w-full min-h-screen">
      {!periodStatus ? (
        <AlertScreen
          title={t("application-dates:not_found.title")}
          description={t("application-dates:not_found.description")}
          Icon={CalendarClock}
        />
      ) : (
        <AvailableDates />
      )}
    </div>
  );
};