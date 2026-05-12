import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { validationSchema } from '../validation';
import RoomInputs from '../inputs/RoomInputs';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useCreateRoom } from '@/hooks/api/rooms.hooks';
import { applyFormServerErrors, showServerMessages } from '@/utils/api.utils';
import { showToast } from '@/utils/toast.util';

const AddRoomModal = () => {
  const { isOpen, openModal, closeModal, getModalData } = useModalStoreV2();
  const modalData = getModalData("add-room");
  const { t } = useTranslation();
  const { id } = useParams();

  const [buildingID, ] = useState("")
  const [buildingType, setBuildingType] = useState("")

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      building_id: ""
    }
  });

  const { 
    mutate: createRoom,
    isPending: isLoading,
    isSuccess,
    data,
    isError,
    error
  } = useCreateRoom();

  const onSubmit = (data) => {
    createRoom(data);
  };

  useEffect(() => {
    if (!modalData?.building) return;
    setBuildingType(modalData?.building.buildingType)
    reset({
      building_id: modalData?.building.buildingID,
    });
  }, [modalData?.building, reset, id]);

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      reset()
      closeModal("add-room")
      openModal("view-room", { id: data?.data?.data?.id });
    } if (isError) {
      const res = error.response;
      if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Popup
      isOpen={isOpen("add-room")} 
      closeModal={() => closeModal('add-room')}
      title={t("rooms:modals.add.title")} 
      description={t("rooms:modals.add.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {<RoomInputs register={register} errors={errors} control={control} building={buildingID} buildingType={buildingType} />}
        <div className='flex gap-2'>
          <Button 
            variant="success"
            size="md"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t("buttons:isLoading") : t("buttons:add")}
          </Button>
          <Button 
            variant="cancel"
            size="md"
            fullWidth
            type="button"
            onClick={() => closeModal("add-room")}
          >
            {t("buttons:cancel")}
          </Button>
        </div>
      </form>
    </Popup>
  )
}

export default AddRoomModal
