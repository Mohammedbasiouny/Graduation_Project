import Heading from '@/components/ui/Heading'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfoCard from '../components/InfoCard'
import { useCountriesStore } from '@/store/use-countries.store'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { EmptyData } from '@/components/ui/Table'

const ResidenceSection = ({ data }) => {
  const { t } = useTranslation()
  const { getCountry } = useCountriesStore();
  const [country, setCountry] = useState(null)
  
  useEffect(() => {
    if (!data) return;

    const c = getCountry(data.passport_issuing_country, "code", "name", true) || { label: "" };

    setCountry(c);
  }, [data, getCountry]);

  return (
    <CollapsibleSection
      title={t("track-application:residence.heading.title")}
      subtitle={t("track-application:residence.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {data.country && (
            <InfoCard
              label={t("fields:country_of_residence.label")}
              value={country?.label}
            />
          )}
          {data.governorate_name && (
            <InfoCard
              label={t("fields:governorate_of_residence.label")}
              value={data.governorate_name}
            />
          )}
          {data.district_or_center_name && (
            <InfoCard
              label={t("fields:police_station_or_center.label")}
              value={data.district_or_center_name}
            />
          )}
          {data.city_or_village_name && (
            <InfoCard
              label={t("fields:city_sheikhdom_or_village.label")}
              value={data.city_or_village_name}
            />
          )}
          {data.detailed_address && (
            <InfoCard
              label={t("fields:detailed_address.label")}
              value={data.detailed_address}
            />
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default ResidenceSection
