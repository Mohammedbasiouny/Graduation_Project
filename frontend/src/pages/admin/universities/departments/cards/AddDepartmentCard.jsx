import { Computer, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ActionCard } from "@/components/ui/ActionCard";

const AddDepartmentCard = ({ openModal = null }) => {
  const { t } = useTranslation();
  
  return (
    <ActionCard
      title={t("manage-departments:cards.add_department.title")}
      description={t("manage-departments:cards.add_department.description")}
      icon={Computer}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={openModal}
      >
        {t("manage-departments:cards.add_department.button")}
      </Button>
      
    </ActionCard>
  );
};

export default AddDepartmentCard;
