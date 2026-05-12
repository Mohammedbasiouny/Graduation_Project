import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Field from '@/components/ui/Form/Field'
import { Label } from '@/components/ui/Form/Label'
import { PasswordInput, Input } from "@/components/ui/Form/Input"
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { useSignup } from './use-signup.hook';
import { validationSchema } from './validation';

const SignupForm = ({ university = "" }) => {
  const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
      resolver: yupResolver(validationSchema),
      mode: 'onChange'
    });

    const { signup, loading } = useSignup();

    const onSubmit = async (data) => {
      const payload = { email: data.email, password: data.password, university };
      await signup(payload, setError);
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
        <DescriptionText description={t("auth:signup_page.messages.email_hint")} />
      </Field>

      <Field className="space-y-2">
        <Label text={t("fields:password.label")} required />
        <PasswordInput
          {...register('password')} 
          error={errors.password?.message}
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

      <Button type="submit" variant="secondary" fullWidth size="md" isLoading={loading}>
        {loading ? t("buttons:isLoading") : t("buttons:signup")}
      </Button>
    </form>
  )
}

export default SignupForm
