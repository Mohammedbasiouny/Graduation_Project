import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { validationSchema } from '../validation';
import RoomInputs from '../inputs/RoomInputs';
import { useEffect, useState } from 'react';
import { useRoom, useUpdateRoom } from '@/hooks/api/rooms.hooks';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import RoomInputsSkeleton from '../inputs/RoomInputsSkeleton';

const EditRoomModal = () => {
  const { t } = useTranslation();
  const { isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("edit-room");

  const [room, setRoom] = useState(null);

  /* ---------------- API ---------------- */
  const { 
    data, 
    isLoading,
  } = useRoom(modalData?.id);

  const { register, handleSubmit, formState: { errors }, control, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { 
    mutate: updateRoom,
    isPending: isUpdating,
    isSuccess,
    isError,
    error
  } = useUpdateRoom();

  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;
    setRoom(row);

    // Reset form with row data
    reset({
      id: row.id,
      building_type: row.building_type,
      name: row.name,
      type: row.type,
      building_id: row.building_id,
      floor: row.floor,
      capacity: row.capacity,
      description: row.description,
      is_available_for_stay: row.is_available_for_stay,
    });
  }, [data, reset]);

  const onSubmit = (data) => {
    if (!room?.id) return;
    updateRoom({ id: room.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      } if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("edit-room")} 
      closeModal={() => closeModal('edit-room')}
      title={t("rooms:modals.edit.title")} 
      description={t("rooms:modals.edit.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {isLoading ? (
            <RoomInputsSkeleton /> 
          ) : (
            <RoomInputs register={register} errors={errors} control={control} buildingType={room?.building_type} />
        )}
        {}
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
            onClick={() => closeModal("edit-room")}
            type="button"
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default EditRoomModal
