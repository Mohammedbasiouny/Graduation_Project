import { Popup } from "@/components/ui/Popup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect, useState } from "react";
import { showToast } from "@/utils/toast.util";

const ToggleRestaurantStatusModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("toggle-restaurant-status");

  const [ui, setUi] = useState({
    title: "",
    description: "",
    actionLabel: "",
    actionVariant: "primary",
  });

  useEffect(() => {
    if (modalData?.restaurantOpen) {
      setUi({
        title: t("meals-schedule:modals.close_restaurant.title"),
        description: t("meals-schedule:modals.close_restaurant.description"),
        actionLabel: t("buttons:close"),
        actionVariant: "danger",
      });
    } else {
      setUi({
        title: t("meals-schedule:modals.open_restaurant.title"),
        description: t("meals-schedule:modals.open_restaurant.description"),
        actionLabel: t("buttons:open"),
        actionVariant: "primary",
      });
    }
  }, [modalData, t]);

  return (
    <Popup
      isOpen={isOpen("toggle-restaurant-status")}
      closeModal={() => closeModal("toggle-restaurant-status")}
      title={ui.title}
      description={ui.description}
    >
      <div className="flex gap-2">
        <Button
          variant={ui.actionVariant}
          size="md"
          fullWidth
        >
          {ui.actionLabel}
        </Button>

        <Button
          variant="cancel"
          size="md"
          fullWidth
          onClick={() => closeModal("toggle-restaurant-status")}
          type="button"
        >
          {t("buttons:cancel")}
        </Button>
      </div>
    </Popup>
  );
};

export default ToggleRestaurantStatusModal;