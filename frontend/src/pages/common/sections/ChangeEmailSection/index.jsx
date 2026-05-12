import { Button } from '@/components/ui/Button'
import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { validationSchema } from './validation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Heading from '@/components/ui/Heading'
import { useChangeEmail } from './hook'

const ChangeEmailSection = ({ userID = null, email = "" }) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const { changeEmail, loading } = useChangeEmail();

  useEffect(() => {
    setValue("new_email", email)
  }, [email])

  const onSubmit = async (data) => {
    changeEmail(data, setError, userID);
  };

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 transition'>
        <Heading
          title={t('account:change_email_heading.title')}
          subtitle={t('account:change_email_heading.subtitle')}
          size="sm"
          align="start"
        />
        <form onSubmit={handleSubmit(onSubmit)} className='h-full space-y-5 mt-5'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            <Field className="space-y-2">
              <Label text={t("fields:email.label")} required />
              <Input
                placeholder={t("fields:email.placeholder")}
                {...register('new_email')} 
                error={errors.new_email?.message}
              />
            </Field>
          </div>

          <p className="w-full max-w-5xl text-gray-800 text-sm xl:text-base leading-relaxed">
            {t("account:notes.change_email.description")}
          </p>

          <Button type="submit" variant="secondary" isLoading={loading}>
            {loading ? t("buttons:isLoading") : t("account:buttons.change_email")}
          </Button>
        </form>
    </div>
  )
}

export default ChangeEmailSection
