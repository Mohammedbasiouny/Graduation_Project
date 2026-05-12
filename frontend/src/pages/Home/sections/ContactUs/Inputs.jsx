import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { Input } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import { Textarea } from '@/components/ui/Form/Textarea';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';

const Inputs = ({ register, errors }) => {
  const { t } = useTranslation();
  
  const textInputs = useMemo(() => [
    { type: "text", field: "full_name", required: false, haveDescription: false },
    { type: "email", field: "email", required: true, haveDescription: false },
    { type: "text", field: "message_title", required: true, haveDescription: true },
  ], [])

  return (
    <div className="w-full flex max-lg:flex-col gap-5">
      {/* Text Inputs */}
      <div className='flex flex-col flex-1 gap-3'>
        {textInputs.map(({ type, field, haveDescription, required }) => (
          <Field key={field} className="space-y-2">
            <Label text={t(`fields:${field}.label`)} required={required} />
            <Input
              type={type}
              {...register(field)}
              placeholder={t(`fields:${field}.placeholder`)}
              error={errors?.[field]?.message}
            />
            {haveDescription && <DescriptionText description={t(`fields:${field}.description`)} />}
          </Field>
        ))}
      </div>

      <Field className="h-full space-y-2 max-lg:flex-1 flex-2">
        <Label text={t("fields:message_content.label")} required />
        <Textarea
          type={"number"}
          {...register("message_content")}
          placeholder={t("fields:message_content.placeholder")}
          error={errors?.message_content?.message}
          rows={7}
        />
        <DescriptionText
          description={t("fields:message_content.description")}
        />
      </Field>
    </div>
  )
}

export default Inputs
