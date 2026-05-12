import { CalendarPlus, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddPeriodCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("application-dates:cards.add_period.title")}
      description={t("application-dates:cards.add_period.description")}
      icon={CalendarPlus}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add")}
      >
        {t("application-dates:cards.add_period.button")}
      </Button>
    </ActionCard>
  );
};

export default AddPeriodCard;
