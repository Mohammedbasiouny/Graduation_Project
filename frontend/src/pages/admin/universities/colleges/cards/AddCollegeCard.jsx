import { GraduationCap, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ActionCard } from "@/components/ui/ActionCard";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddCollegeCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const handleOpenModal = () => {
    openModal("add-college")
  }
  
  return (
    <ActionCard
      title={t("manage-colleges:cards.add_college.title")}
      description={t("manage-colleges:cards.add_college.description")}
      icon={GraduationCap}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={handleOpenModal}
      >
        {t("manage-colleges:cards.add_college.button")}
      </Button>
      
    </ActionCard>
  );
};

export default AddCollegeCard;
