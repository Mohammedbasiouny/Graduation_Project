import { Checkbox } from "@/components/ui/Form/Choice";
import DescriptionText from "@/components/ui/Form/DescriptionText";
import Field from "@/components/ui/Form/Field";
import { Input, InputSkeleton } from "@/components/ui/Form/Input";
import { Label } from "@/components/ui/Form/Label";
import { SelectBox } from "@/components/ui/Form/SelectBox";
import { Textarea } from "@/components/ui/Form/Textarea";
import { BUILDING_TYPE_OPTIONS, ROOM_TYPE_OPTIONS } from "@/constants";
import { useBuildingsOptions } from "@/hooks/options/buildings-options.hooks";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const RoomInputs = ({ buildingType = "", register, errors, control }) => {
  const { t } = useTranslation();

  const [selectedBuildingType, setSelectedBuildingType] = useState("");

  const { options: buildingsOptions, isLoading: buildingsIsLoading } = useBuildingsOptions({ type: selectedBuildingType, enabled: !!selectedBuildingType });

  useEffect(() => {
    setSelectedBuildingType(buildingType)
  }, [buildingType])

  return (
      <>
        <div className="space-y-2">
          <Label text={t("fields:building_type.label")} required />
          <SelectBox
            options={BUILDING_TYPE_OPTIONS()}
            value={selectedBuildingType}
            placeholder={t("fields:building_type.placeholder")}
            onChange={setSelectedBuildingType}
          />
        </div>

        <div className="space-y-2">
          <Label text={t("fields:building.label")} required />
          {buildingsIsLoading ? (
            <InputSkeleton />
          ) : (
            <Controller
              name='building_id'
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  options={buildingsOptions}
                  value={value}
                  placeholder={t("fields:building.placeholder")}
                  onChange={onChange}
                  error={errors?.building_id?.message}
                />
              )}
            />
          )}
          <DescriptionText
            description={t("fields:building.description")}
          />
        </div>

        <Field className="space-y-2">
          <Label text={t("fields:room_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:room_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <div className="space-y-2">
          <Label text={t("fields:room_type.label")} required />
          <Controller
            name='type'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                options={ROOM_TYPE_OPTIONS(['premium', 'regular', 'medical', 'studying'])}
                value={value}
                placeholder={t("fields:room_type.placeholder")}
                onChange={onChange}
                error={errors?.type?.message}
              />
            )}
          />
          <DescriptionText
            description={t("fields:room_type.description")}
          />
        </div>

        <Field className="space-y-2">
          <Label text={t("fields:floor.label")} required />
          <Input 
            type="number"
            {...register("floor")} 
            placeholder={t("fields:floor.placeholder")}
            error={errors?.floor?.message}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:room_capacity.label")} required />
          <Input 
            type="number"
            {...register("capacity")} 
            placeholder={t("fields:room_capacity.placeholder")}
            error={errors?.capacity?.message}
          />
        </Field>

        <div className='space-y-2'>
          <Checkbox
            label={t("fields:is_available_for_stay.label")}
            {...register("is_available_for_stay")}
          />
          <DescriptionText description={t("fields:is_available_for_stay.placeholder")} />
        </div>

        <Field className="space-y-2">
          <Label text={t("fields:description.label")} />
          <Textarea 
            type="number"
            {...register("description")} 
            placeholder={t("fields:description.placeholder")}
            error={errors?.description?.message}
            rows={3}
          />
        </Field>
      </>
  )
}

export default RoomInputs
