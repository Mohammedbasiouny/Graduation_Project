import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import Heading from '@/components/ui/Heading'
import { ROLES_OPTIONS } from '@/constants'
import { translateDate, translateTime } from '@/i18n/utils'
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { validationSchema } from './validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { Button } from '@/components/ui/Button'
import { useCreateUser } from '@/hooks/api/manage-users.hook'
import { showToast } from '@/utils/toast.util'
import { applyFormServerErrors } from '@/utils/api.utils'
import { useNavigate } from 'react-router'

const ManageACcount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, control, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const { 
    mutate: createUser,
    isPending,
    isSuccess,
    data,
    isError,
    error
  } = useCreateUser();

  const onSubmit = (data) => {
    createUser(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:created_successfully"));
      const id = data?.data?.data?.id;
      const role = data?.data?.data?.role;

      if (id && role) {
        navigate(`/admin/accounts/${role}/${id}`);
      }
    } if (isError) {
      const res = error.response;
      if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 transition'>
      <Heading
        title={t('account:my_account_heading.title')}
        size="sm"
        align="start"
      />
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10 mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          <Field className="space-y-2">
            <Label text={t("fields:full_name.label")} required />
            <Input
              {...register('full_name')}
              placeholder={t("fields:full_name.placeholder")}
              error={errors?.full_name?.message}
            />
          </Field>
          <Field className="space-y-2">
            <Label text={t("fields:email.label")} required />
            <Input
              {...register('email')}
              placeholder={t("fields:email.placeholder")}
              error={errors?.email?.message}
            />
          </Field>
          <Field className="space-y-2">
            <Label text={t("fields:ssn.label")} required />
            <Input
              {...register('national_id')}
              placeholder={t("fields:ssn.placeholder")}
              error={errors?.national_id?.message}
            />
          </Field>
          <div className="space-y-2">
            <Label text={t("fields:role.label")} required />
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <SelectBox
                  {...field}
                  placeholder={t("fields:role.placeholder")}
                  options={ROLES_OPTIONS(['admin', 'maintenance', 'cafeteria', 'medical', 'supervisor'])}
                  error={errors?.role?.message}
                />
              )}
            />
          </div>
        </div>

        <div className='flex flex-wrap justify-between gap-5'>
          <Button 
            variant="secondary"
            type="submit"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? t("buttons:isLoading") : t("account:buttons.add_account")}
          </Button>
        </div>
      </form>

    </div>
  )
}

export default ManageACcount
