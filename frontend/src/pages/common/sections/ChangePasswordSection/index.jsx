import { Button } from '@/components/ui/Button'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import Field from '@/components/ui/Form/Field'
import { PasswordInput } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { validationSchema } from './validation'
import { useForm } from 'react-hook-form'
import Heading from '@/components/ui/Heading'
import { useChangePassword } from './hook'

const ChangePasswordSection = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const { changePassword, loading } = useChangePassword()

  const onSubmit = async (data) => {
    const payload = { old_password: data.old_password, new_password: data.new_password };
    await changePassword(payload, setError);
  };

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 transition'>
      <Heading
        title={t('account:change_password_heading.title')}
        subtitle={t('account:change_password_heading.subtitle')}
        size="sm"
        align="start"
      />
      <form onSubmit={handleSubmit(onSubmit)} className='h-full space-y-5 mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          <Field className="space-y-2">
            <Label text={t("fields:old_password.label")} required />
            <PasswordInput
              placeholder={t("fields:old_password.placeholder")}
              {...register('old_password')} 
              error={errors.old_password?.message}
            />
          </Field>

          <Field className="space-y-2">
            <Label text={t("fields:password.label")} required />
            <PasswordInput
              placeholder={t("fields:password.placeholder")}
              {...register('new_password')} 
              error={errors.new_password?.message}
            />
            <DescriptionText description={t("auth:signup_page.messages.password_hint")} />
          </Field>

          <Field className="space-y-2">
            <Label text={t("fields:confirm_password.label")} required />
            <PasswordInput
              placeholder={t("fields:confirm_password.placeholder")}
              {...register('confirm_password')} 
              error={errors.confirm_password?.message}
            />
          </Field>
        </div>

        <Button type="submit" variant="secondary" isLoading={loading}>
          {loading ? t("buttons:isLoading") : t("account:buttons.change_password")}
        </Button>
      </form>
    </div>
  )
}

export default ChangePasswordSection
