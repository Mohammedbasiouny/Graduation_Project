import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';

const GovernorateInputs = ({ register, errors }) => {
  const { t } = useTranslation();
  return (
      <>
        <Field className="space-y-2">
          <Label text={t("fields:governorate_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:governorate_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>
        <Field className="space-y-2">
          <Label text={t("fields:distance_from_cairo.label")} required />
          <Input 
            {...register("distance_from_cairo")} 
            placeholder={t("fields:distance_from_cairo.placeholder")}
            error={errors?.distance_from_cairo?.message}
          />
        </Field>

        <div className='space-y-2'>
          <Checkbox
            label={t("fields:is_visible.label")}
            {...register("is_visible")}
          />
          <DescriptionText description={t("fields:is_visible.placeholder")} />
        </div>
      </>
  )
}

export default GovernorateInputs
