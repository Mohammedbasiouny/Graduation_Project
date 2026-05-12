import { useTranslation } from "react-i18next"
import DocumentCard from "../components/DocumentCard"
import Heading from "@/components/ui/Heading"
import CollapsibleSection from "@/components/ui/CollapsibleSection"
import { EmptyData } from "@/components/ui/Table"

const DocumentsSection = ({ data }) => {
  const { t } = useTranslation()

  return (
    <CollapsibleSection
      title={t("track-application:documents.heading.title")}
      subtitle={t("track-application:documents.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 px-4 md:px-6">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="w-full">
              <DocumentCard docKey={key} value={value} />
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default DocumentsSection