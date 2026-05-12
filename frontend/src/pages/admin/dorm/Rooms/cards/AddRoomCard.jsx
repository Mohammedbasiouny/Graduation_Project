import { BedDouble, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ActionCard } from "@/components/ui/ActionCard";

const AddRoomCard = ({ openModal = null }) => {
  const { t } = useTranslation();

  return (
    <ActionCard
      title={t("rooms:cards.add_room.title")}
      description={t("rooms:cards.add_room.description")}
      icon={BedDouble}
      className="h-full"
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={openModal}
      >
        {t("rooms:cards.add_room.button")}
      </Button>
      
    </ActionCard>
  );
};

export default AddRoomCard;
