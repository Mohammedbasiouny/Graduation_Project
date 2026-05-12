import { FileBadge, Plus } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useModalStoreV2 } from "@/store/use.modal.store";

const AddCertificateCard = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  
  return (
    <ActionCard
      title={t("educational-certificates:cards.add_certificate.title")}
      description={t("educational-certificates:cards.add_certificate.description")}
      icon={FileBadge}
    >
      <Button 
        variant="secondary"
        size="md"
        icon={<Plus />}
        onClick={() => openModal("add")}
      >
        {t("educational-certificates:cards.add_certificate.button")}
      </Button>
    </ActionCard>
  );
};

export default AddCertificateCard;
