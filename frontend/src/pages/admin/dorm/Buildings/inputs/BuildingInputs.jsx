import { Checkbox } from "@/components/ui/Form/Choice";
import DescriptionText from "@/components/ui/Form/DescriptionText";
import Field from "@/components/ui/Form/Field";
import { Input } from "@/components/ui/Form/Input";
import { Label } from "@/components/ui/Form/Label";
import { SelectBox } from "@/components/ui/Form/SelectBox";
import { BUILDING_TYPE_OPTIONS } from "@/constants";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const BuildingInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

  return (
      <>
        <Field className="space-y-2">
          <Label text={t("fields:building_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:building_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <div className="space-y-2">
          <Label text={t("fields:building_type.label")} required />
          <Controller
            name='type'
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                options={BUILDING_TYPE_OPTIONS()}
                value={value}
                placeholder={t("fields:building_type.placeholder")}
                onChange={onChange}
                error={errors?.type?.message}
              />
            )}
          />
          <DescriptionText
            description={t("fields:building_type.description")}
          />
        </div>

        <Field className="space-y-2">
          <Label text={t("fields:floors_count.label")} required />
          <Input 
            type="number"
            {...register("floors_count")} 
            placeholder={t("fields:floors_count.placeholder")}
            error={errors?.floors_count?.message}
          />
        </Field>

        <div className='space-y-2'>
          <Checkbox
            label={t("fields:is_available_for_stay.label")}
            {...register("is_available_for_stay")}
          />
          <DescriptionText description={t("fields:is_available_for_stay.placeholder")} />
        </div>
      </>
  )
}

export default BuildingInputs
