import { Button } from '@/components/ui/Button'
import RedirectText from "@/components/ui/RedirectText";
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Field from '@/components/ui/Form/Field'
import { Label } from '@/components/ui/Form/Label'
import { PasswordInput, Input } from "@/components/ui/Form/Input"
import { Checkbox } from '@/components/ui/Form/Choice'
import { validationSchema } from './validation';
import { useLogin } from './use-login.hook';
import { ResendVerificationPopup, useResendVerification } from '../resend-verification';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { useActivation } from './use-activation.hook';

const LoginForm = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();

  const { open, openPopup, closePopup, email } = useResendVerification()

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      email: getParam("email") || ""
    }
  });
  
  useActivation({ openPopup });

  const { login, loading } = useLogin();

  const onSubmit = async (data) => {
    const payload = { email: data.email, password: data.password };
    await login(payload, setError, openPopup);
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field className="space-y-2">
          <Label text={t("fields:email.label")} required />
          <Input
            {...register('email')} 
            error={errors.email?.message}
            placeholder={t("fields:email.placeholder")}
          />
        </Field>

        <Field className="space-y-2">
          <Label text={t("fields:password.label")} required />
          <PasswordInput
            {...register('password')} 
            error={errors.password?.message}
            placeholder={t("fields:password.placeholder")}
          />
        </Field>

        <Checkbox
          label={t("auth:login_page.remember_me")}
          {...register("remember_me")}
        />

        <RedirectText 
          text={t("auth:login_page.go_to_forgot_link")}
          linkText={t("buttons:click_here")}
          linkTo="/auth/forgot-password" 
        />

        <Button type="submit" variant="secondary" fullWidth size="md" isLoading={loading}>
          {loading ? t("buttons:isLoading") : t("buttons:login")}
        </Button>
      </form>

      <ResendVerificationPopup open={open} closePopup={closePopup} email={email} />
    </>
  )
}

export default LoginForm
