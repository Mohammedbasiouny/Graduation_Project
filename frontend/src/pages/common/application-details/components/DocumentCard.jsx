import React from "react"
import { useTranslation } from "react-i18next"
import { FileText, Image as ImageIcon } from "lucide-react"
import { translateNumber } from "@/i18n/utils"

const DocumentCard = ({ docKey, value }) => {
  const { t } = useTranslation()

  const files = Array.isArray(value) ? value : value ? [value] : []
  const hasData = files.length > 0

  const getFileType = (url) => {
    if (!url) return "unknown"
    const cleanUrl = url.split("?")[0]
    const ext = cleanUrl.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image"
    if (["pdf"].includes(ext)) return "pdf"
    return "other"
  }

  return (
    <div className="w-full">
      {/* Header: Title + Files Count */}
      <div className="flex flex-wrap items-center gap-3 mb-4 border-b border-gray-300 pb-2">
        <h3 className="font-semibold text-gray-700 text-base tracking-wide capitalize">
          {t(`application-steps:documents.${docKey}`)}
        </h3>

        {hasData && (
          <span className="inline-flex items-center text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
            {translateNumber(files.length)} {files.length > 1 ? t("track-application:documents.files") : t("track-application:documents.file")}
          </span>
        )}
      </div>

      {/* Files Grid */}
      {hasData && (
        <div className="grid grid-cols-2 gap-3">
          {files.map((file, index) => {
            const type = getFileType(file)
            return (
              <a
                key={index}
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {type === "image" ? (
                  <>
                    <img
                      src={file}
                      alt={`${docKey}-${index}`}
                      loading="lazy"
                      className="w-full h-28 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition">
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition">
                        {t("buttons:view")}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-28 bg-gray-50 hover:bg-gray-100 transition">
                    {type === "pdf" ? (
                      <FileText className="w-7 h-7 text-red-500" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-gray-500" />
                    )}
                    <span className="text-xs mt-1 font-medium">{t("buttons:view")}</span>
                  </div>
                )}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DocumentCard