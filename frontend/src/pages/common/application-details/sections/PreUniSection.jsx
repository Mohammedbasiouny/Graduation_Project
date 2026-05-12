import Heading from '@/components/ui/Heading'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfoCard from '../components/InfoCard'
import { useCountriesStore } from '@/store/use-countries.store'
import { translateNumber } from '@/i18n/utils'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { EmptyData } from '@/components/ui/Table'

const PreUniEduSection = ({ data }) => {
  const { t } = useTranslation()
  const { getCountry } = useCountriesStore();
  const [country, setCountry] = useState(null)
  
  useEffect(() => {
    if (!data) return;

    const c = getCountry(data.certificate_country, "code", "name", true) || { label: "" };

    setCountry(c);
  }, [data, getCountry]);

  return (
    <CollapsibleSection
      title={t("track-application:pre_uni_edu.heading.title")}
      subtitle={t("track-application:pre_uni_edu.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {data.certificate_name && (
            <InfoCard
              label={t("fields:certificate_type.label")}
              value={data.certificate_name}
            />
          )}
          {data.total_score && (
            <InfoCard
              label={t("fields:total_score.label")}
              value={translateNumber(data.total_score)}
            />
          )}
          {data.percentage && (
            <InfoCard
              label={t("fields:percentage.label")}
              value={`${translateNumber(data.percentage)}%`}
            />
          )}
          {data.certificate_country && (
            <InfoCard
              label={t("fields:certificate_country.label")}
              value={country?.label}
            />
          )}
          {data.governorate_name && (
            <InfoCard
              label={t("fields:administrative_region.label")}
              value={data.governorate_name}
            />
          )}
          {data.educational_administration_name && (
            <InfoCard
              label={t("fields:educational_administration.label")}
              value={data.educational_administration_name}
            />
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default PreUniEduSection
