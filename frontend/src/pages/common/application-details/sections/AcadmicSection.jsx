import { useTranslation } from "react-i18next"
import Heading from "@/components/ui/Heading"
import InfoCard from "../components/InfoCard"
import { StatusBadge } from "@/components/ui/StatusBadge"
import CollapsibleSection from "@/components/ui/CollapsibleSection"
import { translateNumber } from "@/i18n/utils"
import { EmptyData } from "@/components/ui/Table"

const AcadmicSection = ({ data }) => {
  const { t } = useTranslation()

  return (
    <CollapsibleSection
      title={t("track-application:acadmic.heading.title")}
      subtitle={t("track-application:acadmic.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {data.department_or_program_name && (
            <InfoCard
              label={t("fields:department_or_program.label")}
              value={data.department_or_program_name}
            />
          )}
          {data.college_name && (
            <InfoCard
              label={t("fields:college.label")}
              value={data.college_name}
            />
          )}
          {data.admission_year && (
            <InfoCard
              label={t("fields:admission_year.label")}
              value={translateNumber(data.admission_year)}
            />
          )}
          {data.study_level && (
            <InfoCard
              label={t("fields:study_level.label")}
              value={t(`fields:study_level.options.${data.study_level}`)}
            />
          )}
          {data.student_code && (
            <InfoCard
              label={t("fields:student_code.label")}
              value={data.student_code}
            />
          )}
          {data.study_system_type && (
            <InfoCard
              label={t("fields:study_system_type.label")}
              value={t(`fields:study_system_type.options.${data.study_system_type}`)}
            />
          )}
          {data.gpa_or_total_score && (
            <InfoCard
              label={t("fields:gpa_or_total_score.label")}
              value={translateNumber(data.gpa_or_total_score)}
            />
          )}
          {data.grade && (
            <InfoCard
              label={t("fields:grade.label")}
              value={t(`fields:grade.options.${data.grade}`)}
            />
          )}
          {data.enrollment_status && (
            <InfoCard
              label={t("fields:enrollment_status.label")}
              value={t(`fields:enrollment_status.options.${data.enrollment_status}`)}
            />
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default AcadmicSection