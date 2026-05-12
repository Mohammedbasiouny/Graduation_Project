import { ClipboardClock, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddMealScheduleCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <ActionCard
      title={t("meals-schedule:cards.add.title")}
      description={t("meals-schedule:cards.add.description")}
      icon={ClipboardClock} // You can change the icon if you want
    >
      <Button
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add")} // use a unique modal key
      >
        {t("meals-schedule:cards.add.button")}
      </Button>
    </ActionCard>
  );
};

export default AddMealScheduleCard;