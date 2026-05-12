import { PlayCircle, Lock } from "lucide-react"; 
import { ActionCard, ActionCardSkeleton } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect, useState } from "react";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { translateDate, translateTime } from "@/i18n/utils";

const ToggleRestaurantStatusCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const [ui, setUi] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonVariant: "primary",
    icon: null,
    infoText: "",
  });


  useEffect(() => {
    setRestaurantOpen(true);
    setUpdatedAt("1999-01-01T00:00:00Z");
  }, []);

  useEffect(() => {
    const formattedDate = translateDate(formatToDateOnly(updatedAt));
    const formattedTime = translateTime(formatToTimeOnly(updatedAt));

    if (restaurantOpen) {
      setUi({
        title: t("meals-schedule:cards.close_restaurant.title"),
        description: t("meals-schedule:cards.close_restaurant.description"),
        buttonText: t("meals-schedule:cards.close_restaurant.button"),
        buttonVariant: "danger",
        icon: Lock,
        infoText: t(
          "meals-schedule:cards.close_restaurant.opened_at",
          { date: formattedDate, time: formattedTime }
        ),
      });
    } else {
      setUi({
        title: t("meals-schedule:cards.open_restaurant.title"),
        description: t("meals-schedule:cards.open_restaurant.description"),
        buttonText: t("meals-schedule:cards.open_restaurant.button"),
        buttonVariant: "primary",
        icon: PlayCircle,
        infoText: t(
          "meals-schedule:cards.open_restaurant.closed_at",
          { date: formattedDate, time: formattedTime }
        ),
      });
    }
  }, [restaurantOpen, updatedAt, t]);

  if (!updatedAt) return <ActionCardSkeleton />;

  return (
    <ActionCard
      title={ui.title}
      description={ui.description}
      icon={restaurantOpen ? Lock : PlayCircle}
    >
      <p
        className={`text-sm sm:text-base text-center font-medium ${
          restaurantOpen ? "text-green-600" : "text-red-600"
        }`}
      >
        {ui.infoText}
      </p>

      <Button
        variant={ui.buttonVariant}
        size="md"
        icon={ui.icon && <ui.icon />}
        onClick={() =>
          openModal("toggle-restaurant-status", {
            restaurantOpen,
          })
        }
      >
        {ui.buttonText}
      </Button>
    </ActionCard>
  );
};

export default ToggleRestaurantStatusCard;