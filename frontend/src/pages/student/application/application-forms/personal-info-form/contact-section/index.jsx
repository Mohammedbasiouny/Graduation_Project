import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label'
import { SelectBox } from '@/components/ui/Form/SelectBox';
import { useCountriesStore } from '@/store/use-countries.store';
import { useTranslation } from 'react-i18next';

const ContactSection = ({ register, errors, dialCode, setDialCode, withLandlineNumber = false }) => {
  const { t } = useTranslation();
  const { getCountryOptions } = useCountriesStore();
  const dialCodeOptions = getCountryOptions("dial_code", "dial_code", true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <Field className="space-y-2">
        <Label text={t("fields:mobile_number.label")} required />
        <div className='flex gap-2'>
          <div className='min-w-35'>
            <SelectBox
              value={dialCode}
              onChange={setDialCode}
              placeholder={t("fields:birth_country.placeholder")}
              options={dialCodeOptions}
            />
          </div>
          <Input
            placeholder={t("fields:mobile_number.placeholder")}
            {...register("mobile_number")} 
            error={errors?.mobile_number?.message}
          />
        </div>
        <DescriptionText
          description={t("fields:mobile_number.description")}
        />
      </Field>

      {withLandlineNumber && (
        <Field className="space-y-2">
          <Label text={t("fields:landline_number.label")} />
          <Input
            placeholder={t("fields:landline_number.placeholder")}
            {...register("landline_number")} 
            error={errors?.landline_number?.message}
          />
          <DescriptionText
            description={t("fields:landline_number.description")}
          />
        </Field>
      )}
    </div>
  )
}

export default ContactSection
