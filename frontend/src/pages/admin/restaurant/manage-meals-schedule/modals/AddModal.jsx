import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, IconButton } from '@/components/ui/Button';
import { scheduleWithMealsValidationSchema } from '../validation';
import ScheduleInputs from '../inputs/ScheduleInputs';
import { useCreateMealSchedule } from '@/hooks/api/meal-schedule.hooks';
import { useEffect } from 'react';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';
import { Label } from '@/components/ui/Form/Label';
import { Plus, X } from 'lucide-react';
import SlotInputs from '../inputs/SlotInputs';
import { translateNumber } from '@/i18n/utils';

const AddModal = () => {
  const { isOpen, openModal, closeModal } = useModalStoreV2();
  const { t } = useTranslation();

  const defaultObj = {
      day_type: "",
      booking_start_time: "",
      booking_end_time: "",
      meals: [
        {
          meal_id: "",
          delivery_start_time: "",
          delivery_end_time: "",
        }
      ],
      notes: "",
    }

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(scheduleWithMealsValidationSchema),
    mode: 'onChange',
    defaultValues: defaultObj
  });


  const { 
    mutate: createMealSchedule,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateMealSchedule();

    /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    createMealSchedule(data);
  };

  const handleCloseModel = () => {
    reset(defaultObj)
    closeModal("add")
  }

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      handleCloseModel()
      openModal("edit", { id: data?.data?.data?.id });
    } if (isError) {
      const res = error.response;
      if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meals",
  });

  return (
    <Popup
      isOpen={isOpen("add")} 
      closeModal={handleCloseModel}
      title={t("meals-schedule:modals.add.title")} 
      description={t("meals-schedule:modals.add.description")}
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className="space-y-6">
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <ScheduleInputs 
              register={register} 
              errors={errors} 
              control={control} 
            />
          </div>

          <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <Label text={t("meals-schedule:meals_added", { count: fields.length == 0 ? t("zero") : translateNumber(fields.length) })} required />
              <Button 
                size='sm'
                type="button"
                onClick={() =>
                  append({
                    meal_id: null,
                    delivery_start_time: "",
                    delivery_end_time: "",
                  })
                }
                variant='info'
                icon={<Plus />}
              >
                {t("meals-schedule:click_to_add_meal")}
              </Button>
            </div>

            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex w-full gap-4 items-start border-t pt-4"
              >
                {/* Meal */}
                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <SlotInputs name='meals' index={index} register={register} errors={errors} control={control} />
                </div>

                {/* Remove */}
                <div className="flex justify-end">
                  <IconButton
                    type="button"
                    icon={X}
                    onClick={() => remove(index)}
                    className="text-red-600 bg-red-50 rounded-md p-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex gap-2'>
          <Button 
            variant="success"
            size="md"
            fullWidth
          >
            {t("buttons:add")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            type="button"
            onClick={handleCloseModel}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddModal
