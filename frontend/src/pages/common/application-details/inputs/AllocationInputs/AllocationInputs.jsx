import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Form/Label';
import { InputSkeleton } from '@/components/ui/Form/Input';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { Textarea } from '@/components/ui/Form/Textarea';
import { useTranslation } from 'react-i18next';
import { useBuildingsOptions } from '@/hooks/options/buildings-options.hooks';
import { BUILDING_TYPE_OPTIONS, ROOM_TYPE_OPTIONS } from '@/constants';
import Field from '@/components/ui/Form/Field';
import { translateNumber } from '@/i18n/utils';
import { useRoomsOptions } from '@/hooks/options/rooms.oprtions.hooks';

const AllocationInputs = ({ register, errors, control, watch, setValue }) => {
  const { t } = useTranslation();

  // ✅ WATCH VALUES (instead of useState)
  const buildingType = watch('building_type');
  const buildingId = watch('building_id');
  const floor = watch('floor');
  const roomType = watch('room_type');

  // ✅ Fetch buildings based on building type
  const {
    options: buildingsOptions,
    isLoading: buildingsIsLoading
  } = useBuildingsOptions({
    type: buildingType,
    enabled: !!buildingType
  });

  // ✅ Get selected building object
  const selectedBuilding = buildingsOptions?.find(
    (b) => b.value === buildingId
  );

  // ✅ Generate floors dynamically
  const floorOptions = selectedBuilding
    ? Array.from({ length: selectedBuilding.floors_count }, (_, i) => ({
        value: i + 1,
        label: `${t("floor")} ${translateNumber(i + 1)}`,
      }))
    : [];

    const {
      options: roomsOptions,
      isLoading: roomsIsLoading
    } = useRoomsOptions({
      building_id: buildingId,
      type: roomType,
      enabled: !!buildingId && !!roomType && !!floor
    })

    const filteredRoomsOptions = roomsOptions?.filter(
      (room) => room.floor === Number(floor)
    );

  // ✅ Reset dependent fields
  useEffect(() => {
    setValue('building_id', "");
    setValue('floor', "");
    setValue('room_type', "");
    setValue('room_id', "");
  }, [buildingType]);

  useEffect(() => {
    setValue('floor', "");
    setValue('room_type', "");
    setValue('room_id', "");
  }, [buildingId]);

  useEffect(() => {
    setValue('room_type', "");
    setValue('room_id', "");
  }, [floor]);

  useEffect(() => {
    setValue('room_id', "");
  }, [roomType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">

      {/* 1️⃣ BUILDING TYPE */}
      <div className="space-y-2">
        <Label text={t("fields:building_type.label")} required />
        <Controller
          name='building_type'
          control={control}
          render={({ field }) => (
            <SelectBox
              options={BUILDING_TYPE_OPTIONS()}
              value={field.value}
              placeholder={t("fields:building_type.placeholder")}
              onChange={field.onChange}
              error={errors?.building_type?.message}
            />
          )}
        />
      </div>

      {/* 2️⃣ BUILDING */}
      <div className="space-y-2">
        <Label text={t("fields:building.label")} required />
        {buildingsIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='building_id'
            control={control}
            render={({ field }) => (
              <SelectBox
                options={buildingsOptions}
                value={field.value}
                placeholder={t("fields:building.placeholder")}
                onChange={field.onChange}
                error={errors?.building_id?.message}
                disabled={!buildingType}
              />
            )}
          />
        )}
      </div>

      {/* 3️⃣ FLOOR */}
      <div className="space-y-2">
        <Label text={t("fields:floor.label")} required />
        <Controller
          name='floor'
          control={control}
          render={({ field }) => (
            <SelectBox
              options={floorOptions}
              value={field.value}
              placeholder={t("fields:floor.placeholder")}
              onChange={field.onChange}
              error={errors?.floor?.message}
              disabled={!buildingId}
            />
          )}
        />
      </div>

      {/* 4️⃣ ROOM TYPE */}
      <div className="space-y-2">
        <Label text={t("fields:room_type.label")} required />
        <Controller
          name='room_type'
          control={control}
          render={({ field }) => (
            <SelectBox
              options={ROOM_TYPE_OPTIONS(['premium', 'regular', 'medical'])}
              value={field.value}
              placeholder={t("fields:room_type.placeholder")}
              onChange={field.onChange}
              error={errors?.room_type?.message}
              disabled={!floor}
            />
          )}
        />
      </div>

      {/* 5️⃣ ROOM (EMPTY INITIALLY) */}
      <div className="space-y-2">
        <Label text={t("fields:room.label")} required />
        {roomsIsLoading ? (
          <InputSkeleton />
        ) : (
          <Controller
            name='room_id'
            control={control}
            render={({ field }) => (
              <SelectBox
                options={filteredRoomsOptions}
                value={field.value}
                placeholder={t("fields:room.placeholder")}
                onChange={field.onChange}
                error={errors?.room_id?.message}
                disabled={!roomType}
              />
            )}
          />
        )}
      </div>

      {/* NOTES */}
      <div className='col-span-1 md:col-span-2 lg:col-span-3'>
        <Field className="space-y-2">
          <Label text={t("fields:notes.label")} />
          <Textarea
            {...register("notes")}
            placeholder={t("fields:notes.placeholder")}
            error={errors?.notes?.message}
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
};

export default AllocationInputs;
