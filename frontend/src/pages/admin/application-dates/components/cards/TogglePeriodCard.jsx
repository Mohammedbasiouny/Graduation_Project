import { PlayCircle, Lock } from "lucide-react"; 
import { ActionCard, ActionCardSkeleton } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect, useState } from "react";
import { usePeriodStatus } from "@/hooks/api/application-dates.hooks";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { translateDate, translateTime } from "@/i18n/utils";

const TogglePeriodCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const [periodStatus, setPeriodStatus] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");
  const [ui, setUi] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonVariant: "primary",
    icon: null,
    infoText: "",
  });

  
  
  const { data, isLoading } = usePeriodStatus();

  useEffect(() => {
    if (!data?.data?.data?.period) return;

    setPeriodStatus(data.data.data.period.status ?? false);
    setUpdatedAt(data.data.data.period.updated_at ?? "");
  }, [data]);

  useEffect(() => {
    const formattedDate = translateDate(formatToDateOnly(updatedAt));
    const formattedTime = translateTime(formatToTimeOnly(updatedAt));

    if (periodStatus) {
      setUi({
        title: t("application-dates:cards.end_period.title"),
        description: t("application-dates:cards.end_period.description"),
        buttonText: t("application-dates:cards.end_period.button"),
        buttonVariant: "danger",
        icon: Lock,
        infoText: t(
          "application-dates:cards.end_period.opened_at",
          { date: formattedDate, time: formattedTime }
        ),
      });
    } else {
      setUi({
        title: t("application-dates:cards.start_period.title"),
        description: t("application-dates:cards.start_period.description"),
        buttonText: t("application-dates:cards.start_period.button"),
        buttonVariant: "primary",
        icon: PlayCircle,
        infoText: t(
          "application-dates:cards.start_period.closed_at",
          { date: formattedDate, time: formattedTime }
        ),
      });
    }
  }, [periodStatus, updatedAt, t]);

  if (!updatedAt || isLoading) return <ActionCardSkeleton />

  return (
    <>
      <ActionCard
        title={ui.title}
        description={ui.description}
        icon={periodStatus ? Lock : PlayCircle}
      >
        {/* Info paragraph */}
        <p className={`text-sm sm:text-base text-center font-medium ${periodStatus ? "text-green-600" : "text-red-600"}`}>
          {ui.infoText}
        </p>

        <Button
          variant={ui.buttonVariant}
          size="md"
          icon={ui.icon && <ui.icon />}
          onClick={() => openModal("toggle-period", { periodStatus: periodStatus })}
        >
          {ui.buttonText}
        </Button>
      </ActionCard>
    </>
  );
};

export default TogglePeriodCard;
