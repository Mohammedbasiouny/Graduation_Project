import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import Heading from '@/components/ui/Heading'
import { UNIVERSITIES_OPTIONS } from '@/constants'
import { translateDate, translateTime } from '@/i18n/utils'
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { validationSchema } from './validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { Button } from '@/components/ui/Button'
import { useModalStoreV2 } from '@/store/use.modal.store'
import { useChangeUser } from '@/hooks/api/manage-users.hook'
import { applyFormServerErrors } from '@/utils/api.utils'
import { showToast } from '@/utils/toast.util'

const ChangeStudentUniSection = ({ user = null }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  const { register, handleSubmit, formState: { errors }, control, setValue, setError } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    setValue("university", user?.university)
  }, [user])

  const { 
    mutate: changeUser,
    isPending,
    isSuccess,
    data,
    isError,
    error
  } = useChangeUser(true);

  const onSubmit = (data) => {
    changeUser({ id: user?.id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    } if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      } if (res?.status == 422) {
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
          <div className="space-y-2">
            <Label text={t("fields:university.label")} required />
            <Controller
              name='university'
              control={control}
              render={({ field }) => (
                <SelectBox
                  {...field}
                  placeholder={t("fields:university.placeholder")}
                  options={UNIVERSITIES_OPTIONS(['hu', 'hnu', 'hitu'])}
                  error={errors?.university?.message}
                />
              )}
            />
          </div>
          <Field className="space-y-2">
            <Label text={t("fields:account_started.label")} required />
            <Input
              disabled
              placeholder={t("fields:account_started.placeholder")}
              value={`${translateDate(formatToDateOnly(user?.created_at))}  -  ${translateTime(formatToTimeOnly(user?.created_at))}`}
            />
          </Field>
          <Field className="space-y-2">
            <Label text={t("fields:account_stopped.label")} required />
            <Input
              disabled
              placeholder={t("fields:account_stopped.placeholder")}
              value={user?.end_date ? `${translateDate(formatToDateOnly(user?.end_date))}  -  ${translateTime(formatToTimeOnly(user?.end_date))}` : t("NA")}
            />
          </Field>
        </div>

        <div className='flex flex-wrap justify-between gap-5'>
          <Button 
            variant="secondary"
            type="submit"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? t("buttons:isLoading") : t("account:buttons.change_user_info")}
          </Button>

          <div className='flex flex-wrap space-x-3'>
            <Button 
              type="button" 
              variant={!user?.end_date ? "black" : "info"}
              onClick={() => openModal("block-user", { id: user?.id, status: !user?.end_date })}
              >
              {t(`account:buttons.${!user?.end_date ? "block_account" : "unblock_account"}`)}
            </Button>
            <Button 
              type="button" 
              variant="danger"
              onClick={() => openModal("delete-user", { id: user.id })}
            >
              {t("account:buttons.delete_account")}
            </Button>
          </div>
        </div>
      </form>

    </div>
  )
}

export default ChangeStudentUniSection
