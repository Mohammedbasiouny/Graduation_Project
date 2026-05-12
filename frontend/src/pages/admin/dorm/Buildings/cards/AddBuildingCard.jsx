import { Building, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ActionCard } from "@/components/ui/ActionCard";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddBuildingCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const handleOpenModal = () => {
    openModal("add-building")
  }
  
  return (
    <ActionCard
      title={t("buildings:cards.add_building.title")}
      description={t("buildings:cards.add_building.description")}
      icon={Building}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={handleOpenModal}
      >
        {t("buildings:cards.add_building.button")}
      </Button>
      
    </ActionCard>
  );
};

export default AddBuildingCard;
