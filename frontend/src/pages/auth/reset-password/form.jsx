import RedirectText from "@/components/ui/RedirectText";
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Field from '@/components/ui/Form/Field'
import { Label } from '@/components/ui/Form/Label'
import { PasswordInput } from "@/components/ui/Form/Input"
import { validationSchema } from './validation';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { useResetPassword } from './use-reset-password.hook';

const ResetPasswordForm = ({ email, otp }) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const { resetPassword, loading } = useResetPassword()

  const onSubmit = async (data) => {
    const payload = { email, otp, newPassword: data.newPassword };
    await resetPassword(payload, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field className="space-y-2">
        <Label text={t("fields:password.label")} required />
        <PasswordInput
          {...register('newPassword')} 
          error={errors.newPassword?.message}
          placeholder={t("fields:password.placeholder")}
        />
        <DescriptionText description={t("auth:signup_page.messages.password_hint")} />
      </Field>

      <Field className="space-y-2">
        <Label text={t("fields:confirm_password.label")} required />
        <PasswordInput
          {...register('confirm_password')} 
          error={errors.confirm_password?.message}
          placeholder={t("fields:confirm_password.placeholder")}
        />
      </Field>

      <RedirectText 
        text={t("auth:reset_pass_page.go_to_login_link")}
        linkText={t("buttons:login")}
        linkTo="/auth/login" 
      />

      <Button variant="secondary" fullWidth size="md" isLoading={loading}>
        {loading ? t("buttons:isLoading") : t("auth:reset_pass_page.button")}
      </Button>
    </form>
  )
}

export default ResetPasswordForm
