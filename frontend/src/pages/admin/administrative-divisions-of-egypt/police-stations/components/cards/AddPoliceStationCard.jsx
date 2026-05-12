import { Plus, Shield } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddPoliceStationCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("police-stations:cards.add_police_station.title")}
      description={t("police-stations:cards.add_police_station.description")}
      icon={Shield}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add-police-station")}
      >
        {t("police-stations:cards.add_police_station.button")}
      </Button>
    </ActionCard>
  );
};

export default AddPoliceStationCard;
