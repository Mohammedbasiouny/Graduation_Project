import { Button } from '@/components/ui/Button'
import RedirectText from "@/components/ui/RedirectText";
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Field from '@/components/ui/Form/Field'
import { Label } from '@/components/ui/Form/Label'
import { Input } from "@/components/ui/Form/Input"
import { validationSchema } from './validation';
import { useForgotPassword } from './use-forgot-password.hook';

const ForgotPasswordForm = () => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const { forgotPassword, loading } = useForgotPassword();

  const onSubmit = async (data) => {
    await forgotPassword({ email: data.email }, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field className="space-y-2">
        <Label text={t("fields:email.label")} required />
        <Input
          {...register('email')} 
          error={errors.email?.message}
          placeholder={t("fields:email.placeholder")}
        />
      </Field>

      <RedirectText 
        text={t("auth:forgot_pass_page.go_to_login_link")}
        linkText={t("buttons:login")}
        linkTo="/auth/login" 
      />

      <Button variant="secondary" fullWidth size="md" isLoading={loading}>
        {loading ? t("buttons:isLoading") : t("auth:forgot_pass_page.button")}
      </Button>
    </form>
  )
}

export default ForgotPasswordForm
