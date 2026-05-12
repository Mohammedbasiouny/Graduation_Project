import { Button } from "@/components/ui/Button";
import NormalSpinner from "@/components/ui/NormalSpinner";
import { DetailRow, DetailsCard, Popup } from "@/components/ui/Popup";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMeal } from "@/hooks/api/meals.hooks";
import { translateNumber } from "@/i18n/utils";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { getMealActiveStatus } from "@/utils/meal-activated-status.utils";
import { Beef } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view-meal");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [meal, setMeal] = useState(null);
  const [mealStatus, setMealStatus] = useState(null);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useMeal(modalData?.id);
  
  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setMeal(row);
    setMealStatus(getMealActiveStatus(row.is_active));
  }, [data, t]);

  const columns = useMemo(
    () => [
      t("meals:table.columns.id"),
      t("meals:table.columns.name"),
      t("meals:table.columns.category"),
      t("meals:table.columns.is_active"),
      t("meals:table.columns.description"),
    ],
    [t]
  );

  const handleCloseModal = () => {
    closeModal("view-meal")
  }

  const handleOpenEditModal = () => {
    openModal("edit-meal", { id: modalData?.id })
    closeModal("view-meal")
  }

  const handleDeleteEditModal = () => {
    openModal("delete-meal", { id: modalData?.id })
    handleCloseModal()
  }

  return (
    <Popup
      isOpen={isOpen("view-meal")} 
      closeModal={handleCloseModal}
      title={t("meals:modals.view.title")}
      description={t("meals:modals.view.description")}
    >
      {!meal || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<Beef size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={meal?.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(meal?.id)} />
                <DetailRow label={columns[2]} value={t(`fields:meal_category.options.${meal?.category}`)} />
                <DetailRow 
                  label={columns[3]} 
                  value={
                    <StatusBadge variant={mealStatus?.variant} size="small">
                      {mealStatus?.label}
                    </StatusBadge>
                  }
                />
                <DetailRow label={columns[4]} value={meal?.description || ""} />
              </div>
            </div>
          </DetailsCard>

          <div className='flex gap-2'>
            <Button 
              variant="info"
              size="md"
              fullWidth
              onClick={handleOpenEditModal}
              type="button"
            >
              {t("buttons:edit")}
            </Button>
            <Button 
              variant="danger"
              size="md"
              fullWidth
              onClick={handleDeleteEditModal}
              type="button"
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={handleCloseModal}
              type="button"
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ViewModal;
