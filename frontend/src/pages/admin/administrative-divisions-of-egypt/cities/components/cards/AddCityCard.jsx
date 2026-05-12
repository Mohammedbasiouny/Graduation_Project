import { GraduationCap, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddCityCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("cities:cards.add_city.title")}
      description={t("cities:cards.add_city.description")}
      icon={GraduationCap}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add-city")}
      >
        {t("cities:cards.add_city.button")}
      </Button>
    </ActionCard>
  );
};

export default AddCityCard;
