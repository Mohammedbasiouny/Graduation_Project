import { useModalStoreV2 } from "@/store/use.modal.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validationSchema } from "../validation";
import MealInputs from "../inputs/MealInputs";
import { Popup } from "@/components/ui/Popup";
import { Button } from "@/components/ui/Button";
import { useMeal, useUpdateMeal } from "@/hooks/api/meals.hooks";
import { showToast } from "@/utils/toast.util";
import { applyFormServerErrors } from "@/utils/api.utils";
import MealInputsSkeleton from "../inputs/MealInputsSkeleton";

const EditModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-meal");

  /* ---------------- Data State ---------------- */
  const [meal, setMeal] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useMeal(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateMeal,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateMeal();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    setMeal({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      is_active: row.is_active,
    });

    // Reset form with row data
    reset({
      name: row.name,
      category: row.category,
      description: row.description,
      is_active: row.is_active,
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!meal?.id) return;
    updateMeal({ id: meal.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      }if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const handleCloseModal = () => {
      reset({
        name: "",
        category: "",
        description: "",
        is_active: "",
      })
      closeModal("edit-meal")
  }

  return (
    <Popup
      isOpen={isOpen("edit-meal")} 
      closeModal={handleCloseModal}
      title={t("meals:modals.edit.title")} 
      description={t("meals:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <MealInputsSkeleton /> 
          ) : (
            <MealInputs 
              register={register} 
              errors={errors} 
              control={control} 
            />
        )}
        <div className='flex gap-2'>
          <Button 
            variant="info"
            size="md"
            fullWidth
            isLoading={isLoading || isUpdating}
            disabled={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? t("buttons:isLoading") : t("buttons:edit")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            disabled={isLoading}
            onClick={handleCloseModal}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditModal
