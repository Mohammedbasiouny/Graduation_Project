import { useModalStoreV2 } from "@/store/use.modal.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Popup } from "@/components/ui/Popup";
import { Button } from "@/components/ui/Button";
import { scheduleValidationSchema } from "../validation";
import ScheduleInputs from "../inputs/ScheduleInputs";
import { useMealSchedule, useUpdateMealSchedule } from "@/hooks/api/meal-schedule.hooks";
import { formatToDatetimeLocal } from "@/utils/format-date-and-time.utils";
import { showToast } from "@/utils/toast.util";
import { applyFormServerErrors } from "@/utils/api.utils";

const EditScheduleModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-schedule");

  /* ---------------- Data State ---------------- */
  const [mealSchedule, setMealSchedule] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useMealSchedule(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(scheduleValidationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateMealSchedule,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateMealSchedule();

  /* ---------------- Populate Form ---------------- */
  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    setMealSchedule({
      id: row.id,
      day_type: row.day_type,
      booking_start_time: row.booking_start_time,
      booking_end_time: row.booking_end_time,
      notes: row.notes
    });

    // Reset form with row data
    reset({
      day_type: row.day_type,
      booking_start_time: formatToDatetimeLocal(row.booking_start_time),
      booking_end_time: formatToDatetimeLocal(row.booking_end_time),
      notes: row.notes
    });
  }, [data, reset]);

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    if (!mealSchedule?.id) return;
    updateMealSchedule({ id: mealSchedule.id, data });
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
      day_type: "",
      booking_start_time: "",
      booking_end_time: "",
      notes: ""
    })
    closeModal("edit-schedule")
  }

  return (
    <Popup
      isOpen={isOpen("edit-schedule")} 
      closeModal={handleCloseModal}
      title={t("meals-schedule:modals.edit.title")} 
      description={t("meals-schedule:modals.edit.description")}
    >
      <div className="space-y-4 mb-4">
        <ScheduleInputs 
          register={register} 
          errors={errors} 
          control={control} 
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex gap-2'>
          <Button 
            variant="info"
            size="md"
            fullWidth
          >
            {t("buttons:edit")}
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
      </form>
    </Popup>
  )
}

export default EditScheduleModal
