import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import CollapsibleSection from "@/components/ui/CollapsibleSection"
import InfoCard from "../components/InfoCard"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { EmptyData } from "@/components/ui/Table"
import i18n from "@/i18n"

const MedicalSection = ({ data }) => {
  const { t } = useTranslation()
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (!data) {
      setEntries([])
      return
    }

    const excludedKeys = [
      "id",
      "student_id",
      "user_id",
      "created_at",
      "updated_at"
    ]

    const filteredEntries = Object.entries(data).filter(
      ([key, value]) =>
        !excludedKeys.includes(key) &&
        !key.endsWith("_details") &&
        value !== null &&
        value !== ""
    )

    setEntries(filteredEntries)
  }, [data])

  if (!data || entries.length === 0) {
    return (
      <CollapsibleSection
        title={t("track-application:medical.heading.title")}
        subtitle={t("track-application:medical.heading.subtitle")}
      >
        <EmptyData />
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection
      title={t("track-application:medical.heading.title")}
      subtitle={t("track-application:medical.heading.subtitle")}
    >
      <div className="grid grid-cols-1 gap-6 px-4 md:px-6">
        {entries.map(([key, value]) => {
          const labelKey = `track-application:medical.fields.${key}`
          const valueKey = `track-application:medical.options.${value}`

          // ❌ skip if label translation doesn't exist
          if (!i18n.exists(labelKey)) return null

          const details = data?.[`${key}_details`]

          // BOOLEAN TYPE
          if (typeof value === "boolean") {
            return (
              <InfoCard
                key={key}
                label={t(labelKey)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium
                        ${value 
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                          : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                    >
                      {value ? t("yes") : t("no")}
                    </div>
                  </div>

                  {value && details && (
                    <p className="text-base text-gray-600 pl-1 border-l-2 border-emerald-200">
                      {details}
                    </p>
                  )}
                </div>
              </InfoCard>
            )
          }

          // ❌ skip if value translation doesn't exist (optional depending on your case)
          if (!i18n.exists(valueKey)) return null

          return (
            <InfoCard
              key={key}
              label={t(labelKey)}
              value={t(valueKey)}
            />
          )
        })}
      </div>
    </CollapsibleSection>
  )
}

export default MedicalSection