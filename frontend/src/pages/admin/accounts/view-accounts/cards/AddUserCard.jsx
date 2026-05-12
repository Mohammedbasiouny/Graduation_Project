import { UserPlus, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { NavLink } from "react-router";

const AddUserCard = () => {
  const { t } = useTranslation();

  return (
    <ActionCard
      title={t("account:cards.add_user.title")}
      description={t("account:cards.add_user.description")}
      icon={UserPlus}
    >
      <NavLink to={"add-account"} className={"w-full"}>
        <Button
          variant="secondary"
          size="md"
          icon={<Plus />}
          fullWidth
        >
          {t("account:cards.add_user.button")}
        </Button>
      </NavLink>
    </ActionCard>
  );
};

export default AddUserCard;