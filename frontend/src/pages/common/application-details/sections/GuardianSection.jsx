import Heading from '@/components/ui/Heading'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfoCard from '../components/InfoCard'
import { splitPhoneNumber } from '@/validation/rules'
import { useCountriesStore } from '@/store/use-countries.store'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { EmptyData } from '@/components/ui/Table'

const GuardianSection = ({ data }) => {
  const { t } = useTranslation()
  const { getCountry } = useCountriesStore();
  const [nationality, setNationality] = useState(null)
  const [phone, setPhone] = useState(null)
  
  useEffect(() => {
    if (!data) return;
    const n = getCountry(data.nationality, "code", "name", true) || { label: "" };
    const pn = data.mobile_number ? splitPhoneNumber(data.mobile_number) : { d: "", pn: "" };

    setNationality(n);
    setPhone(pn)
  }, [data, getCountry]);



  return (
    <CollapsibleSection
      title={t(`track-application:guardian.heading.title`)}
      subtitle={t(`track-application:guardian.heading.subtitle`)}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {data.full_name && (
            <InfoCard
              label={t("fields:full_name.label")}
              value={data.full_name}
            />
          )}
          {data.national_id && (
            <InfoCard
              label={t("fields:ssn.label")}
              value={data.national_id}
            />
          )}
          {data.job_title && (
            <InfoCard
              label={t("fields:job_title.label")}
              value={data.job_title}
            />
          )}
          {data.identity_number && (
            <InfoCard
              label={t("fields:identity_number.label")}
              value={data.identity_number}
            />
          )}
          {data.nationality && (
            <InfoCard
              label={t("fields:nationality.label")}
              value={nationality?.label}
            />
          )}
          {data.relationship && (
            <InfoCard
              label={t("fields:relationship.label")}
              value={data.relationship}
            />
          )}
          {data.mobile_number && phone?.dialCode && phone?.phoneNumber && (
            <InfoCard label={t("fields:mobile_number.label")}>
              <div className="flex rtl:flex-row-reverse items-center gap-2 bg-gray-50 rounded-lg p-2 w-fit">
                <span className="text-gray-700 font-medium px-2 py-1 bg-gray-200 rounded-md">{phone?.dialCode}</span>
                <span className="text-gray-900 font-semibold text-lg">{phone?.phoneNumber}</span>
              </div>
            </InfoCard>
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default GuardianSection
