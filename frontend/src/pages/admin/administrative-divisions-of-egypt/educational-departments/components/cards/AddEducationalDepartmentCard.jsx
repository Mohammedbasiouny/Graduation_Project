import { GraduationCap, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddEducationalDepartmentCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("educational-departments:cards.add_department.title")}
      description={t("educational-departments:cards.add_department.description")}
      icon={GraduationCap}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add-educational-department")}
      >
        {t("educational-departments:cards.add_department.button")}
      </Button>
    </ActionCard>
  );
};

export default AddEducationalDepartmentCard;
