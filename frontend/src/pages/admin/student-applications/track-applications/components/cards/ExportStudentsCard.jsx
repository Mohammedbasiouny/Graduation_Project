import { Files, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { NavLink } from "react-router";

const ExportStudentsCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("manage-student-applications:cards.export_students.title")}
      description={t("manage-student-applications:cards.export_students.description")}
      icon={Files}
    >
      <NavLink
        className={"w-full"}
        to={"/admin/applications/export-data"}
      >
        <Button 
          variant="secondary"
          size="md"
          icon={<Plus />}
          onClick={() => openModal("add")}
          fullWidth
        >
          {t("manage-student-applications:cards.export_students.button")}
        </Button>
      </NavLink>
    </ActionCard>
  );
};

export default ExportStudentsCard;
