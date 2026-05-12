import { Files, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { NavLink } from "react-router";

const ManageAcceptanceCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("manage-student-applications:cards.manage_acceptance.title")}
      description={t("manage-student-applications:cards.manage_acceptance.description")}
      icon={Files}
    >
      <NavLink
        className={"w-full"}
        to={"/admin/applications/manage-acceptance"}
      >
        <Button 
          variant="primary"
          size="md"
          icon={<Plus />}
          onClick={() => openModal("add")}
          fullWidth
        >
          {t("manage-student-applications:cards.manage_acceptance.button")}
        </Button>
      </NavLink>
    </ActionCard>
  );
};

export default ManageAcceptanceCard;
