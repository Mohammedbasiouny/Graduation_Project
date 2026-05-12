import { useTranslation } from "react-i18next"
import Heading from "@/components/ui/Heading"
import InfoCard from "../components/InfoCard"
import { StatusBadge } from "@/components/ui/StatusBadge"
import CollapsibleSection from "@/components/ui/CollapsibleSection"
import { EmptyData } from "@/components/ui/Table"

const HousingSection = ({ data }) => {
  const { t } = useTranslation()

  return (
    <CollapsibleSection
      title={t("track-application:housing.heading.title")}
      subtitle={t("track-application:housing.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Housing Type */}
          <InfoCard
            label={t("fields:housing_type.label")}
            value={t(`fields:housing_type.options.${data.housing_type}`)}
          />

          {/* Meals */}
          <InfoCard
            label={t("fields:meals.label")}
          >
            <StatusBadge size={"small"} variant={data.meals ? "success" : "error"}>
              {data.meals ? t("yes") : t("no")}
            </StatusBadge>
          </InfoCard>
        </div>
      )}
    </CollapsibleSection>
  )
}

export default HousingSection