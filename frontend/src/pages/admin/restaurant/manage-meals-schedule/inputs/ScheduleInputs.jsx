import Field from "@/components/ui/Form/Field"
import { Input } from "@/components/ui/Form/Input"
import { Label } from "@/components/ui/Form/Label"
import { SelectBox } from "@/components/ui/Form/SelectBox"
import { Textarea } from "@/components/ui/Form/Textarea"
import { DAY_TYPE_OPTIONS } from "@/constants"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

const ScheduleInputs = ({ register, errors, control }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Day Type */}
      <div className="space-y-2">
        <Label text={t("fields:day_type.label")} required />
        <Controller
          name="day_type"
          control={control}
          render={({ field }) => (
            <SelectBox
              {...field}
              placeholder={t("fields:day_type.placeholder")}
              options={DAY_TYPE_OPTIONS()}
              error={errors?.day_type?.message}
            />
          )}
        />
      </div>

      {/* Booking Start */}
      <Field className="space-y-2">
        <Label text={t("fields:booking_start_time.label")} required />
        <Input
          type="datetime-local"
          {...register("booking_start_time")}
          error={errors?.booking_start_time?.message}
        />
      </Field>

      {/* Booking End */}
      <Field className="space-y-2">
        <Label text={t("fields:booking_end_time.label")} required />
        <Input
          type="datetime-local"
          {...register("booking_end_time")}
          error={errors?.booking_end_time?.message}
        />
      </Field>

      <Field className="col-span-1 md:col-span-3 space-y-2 w-full">
        <Label text={t("fields:notes.label")} />
        <Textarea
          {...register("notes")}
          placeholder={t("fields:notes.placeholder")}
          error={errors?.notes?.message}
          rows={4}
        />
      </Field>
    </>
  )
}

export default ScheduleInputs