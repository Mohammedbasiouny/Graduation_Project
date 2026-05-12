import { useTranslation } from "react-i18next"
import Heading from "@/components/ui/Heading"
import InfoCard from "../components/InfoCard"
import { StatusBadge } from "@/components/ui/StatusBadge"
import CollapsibleSection from "@/components/ui/CollapsibleSection"
import { EmptyData } from "@/components/ui/Table"

const ParentsStatusSection = ({ data }) => {
  const { t } = useTranslation()

  return (
    <CollapsibleSection
      title={t("track-application:parents_status.heading.title")}
      subtitle={t("track-application:parents_status.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Housing Type */}
          <InfoCard
            label={t("fields:parents_status.label")}
            value={t(`fields:parents_status.options.${data.parents_status}`)}
          />

          {/* Meals */}
          <InfoCard
            label={t("fields:family_residency_abroad.label")}
          >
            <StatusBadge size={"small"} variant={data.family_residency_abroad ? "success" : "error"}>
              {data.family_residency_abroad ? t("yes") : t("no")}
            </StatusBadge>
          </InfoCard>

        </div>
      )}
    </CollapsibleSection>
  )
}

export default ParentsStatusSection