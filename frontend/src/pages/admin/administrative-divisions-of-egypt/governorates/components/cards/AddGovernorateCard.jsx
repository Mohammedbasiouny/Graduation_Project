import { MapPin, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useTranslation } from "react-i18next";

const AddGovernorateCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("governorates:cards.add.title")}
      description={t("governorates:cards.add.description")}
      icon={MapPin}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add-governorate")}
      >
        {t("governorates:cards.add.button")}
      </Button>
    </ActionCard>
  );
};

export default AddGovernorateCard;
