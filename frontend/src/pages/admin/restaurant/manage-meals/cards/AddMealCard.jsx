import { Coffee, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddMealCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <ActionCard
      title={t("meals:cards.add_meal.title")}
      description={t("meals:cards.add_meal.description")}
      icon={Coffee} // You can change the icon if you want
    >
      <Button
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add-meal")} // use a unique modal key
      >
        {t("meals:cards.add_meal.button")}
      </Button>
    </ActionCard>
  );
};

export default AddMealCard;