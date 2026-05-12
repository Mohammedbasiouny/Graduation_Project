import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import Heading from '@/components/ui/Heading'
import { translateDate, translateTime } from '@/i18n/utils'
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

const UserInfoSection = ({ user = null }) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 transition'>
      <Heading
        title={t('account:my_account_heading.title')}
        size="sm"
        align="start"
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        <Field className="space-y-2">
          <Label text={t("fields:full_name.label")} required />
          <Input
            disabled
            placeholder={t("fields:full_name.placeholder")}
            value={user?.full_name}
          />
        </Field>
        <Field className="space-y-2">
          <Label text={t("fields:ssn.label")} required />
          <Input
            disabled
            placeholder={t("fields:ssn.placeholder")}
            value={user?.national_id}
          />
        </Field>
        <Field className="space-y-2">
          <Label text={t("fields:role.label")} required />
          <Input
            disabled
            placeholder={t("fields:role.placeholder")}
            value={t(`fields:role.options.${user?.role}`)}
          />
        </Field>
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
            value={user?.end_date ? translateDate(formatToDateOnly(user?.end_date)) : t("NA")}
          />
        </Field>
      </div>
    </div>
  )
}

export default UserInfoSection
