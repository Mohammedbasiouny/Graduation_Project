import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Textarea from '@/components/ui/Form/Textarea/Textarea';
import Checkbox from '@/components/ui/Form/Choice/Checkbox';

const CertificateInpus = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
      <>
        <Field className="space-y-2">
          <Label text={t("fields:certificate_name.label")} required />
          <Input 
            {...register("name")} 
            placeholder={t("fields:certificate_name.placeholder")}
            error={errors?.name?.message}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:degree.label")} required />
          <Input 
            type="number"
            {...register("degree")} 
            placeholder={t("fields:degree.placeholder")}
            error={errors?.degree?.message}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:notes.label")} />
          <Textarea 
            type="number"
            {...register("notes")} 
            placeholder={t("fields:notes.placeholder")}
            error={errors?.notes?.message}
            rows={3}
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

export default CertificateInpus
