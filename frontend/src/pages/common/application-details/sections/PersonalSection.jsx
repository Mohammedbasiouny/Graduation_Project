import Heading from '@/components/ui/Heading'
import { translateDate } from '@/i18n/utils'
import { formatToDateOnly } from '@/utils/format-date-and-time.utils'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfoCard from '../components/InfoCard'
import { splitPhoneNumber } from '@/validation/rules'
import { useCountriesStore } from '@/store/use-countries.store'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { EmptyData } from '@/components/ui/Table'
import { Mars, User, Venus } from 'lucide-react'

const PersonalSection = ({ data }) => {
  const { t } = useTranslation()
  const { getCountry } = useCountriesStore();
  const [passportissuingCountry, setPassportissuingCountry] = useState(null)
  const [nationality, setNationality] = useState(null)
  const [birthCountry, setBirthCountry] = useState(null)
  const [phone, setPhone] = useState(null)
  
  useEffect(() => {
    if (!data) return;

    const p = getCountry(data.passport_issuing_country, "code", "name", true) || { label: "" };
    const n = getCountry(data.nationality, "code", "name", true) || { label: "" };
    const bc = getCountry(data.birth_country, "code", "name", true) || { label: "" };
    const pn = data.mobile_number ? splitPhoneNumber(data.mobile_number) : { d: "", pn: "" };

    setPassportissuingCountry(p);
    setNationality(n);
    setBirthCountry(bc)
    setPhone(pn)
  }, [data, getCountry]);

  return (
    <CollapsibleSection
      title={t("track-application:personal.heading.title")}
      subtitle={t("track-application:personal.heading.subtitle")}
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
          {data.passport_number && (
            <InfoCard
              label={t("fields:passport_number.label")}
              value={data.passport_number}
            />
          )}
          {data.passport_issuing_country && (
            <InfoCard
              label={t("fields:passport_issuing_country.label")}
              value={passportissuingCountry?.label}
            />
          )}
          {data.nationality && (
            <InfoCard
              label={t("fields:nationality.label")}
              value={nationality?.label}
            />
          )}
          {data.gender && (
            <InfoCard
              label={t("fields:gender.label")}
              value={
                <div className="flex items-center gap-2">
                  {data.gender === 'male' && <Mars className="w-5 h-5 text-blue-500" />}
                  {data.gender === 'female' && <Venus className="w-5 h-5 text-pink-500" />}
                  {!['male', 'female'].includes(data.gender) && <User className="w-5 h-5 text-gray-500" />}
                  <span>{t(`gender.${data.gender}`)}</span>
                </div>
              }
            />
          )}
          {data.religion && (
            <InfoCard
              label={t("fields:religion.label")}
              value={t(`religion.${data.religion}`)}
            />
          )}
          {data.place_of_birth && (
            <InfoCard
              label={t("fields:place_of_birth.label")}
              value={data.place_of_birth}
            />
          )}
          {data.birth_country && (
            <InfoCard
              label={t("fields:birth_country.label")}
              value={birthCountry?.label}
            />
          )}
          {data.birth_city && (
            <InfoCard
              label={t("fields:birth_city.label")}
              value={data.birth_city}
            />
          )}
          {data.date_of_birth && (
            <InfoCard
              label={t("fields:date_of_birth.label")}
              value={translateDate(formatToDateOnly(data.date_of_birth))}
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
          {data.landline_number && (
            <InfoCard
              label={t("fields:landline_number.label")}
              value={data.landline_number}
            />
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default PersonalSection
