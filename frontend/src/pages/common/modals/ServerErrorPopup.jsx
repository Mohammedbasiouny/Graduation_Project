import { Button } from '@/components/ui/Button'
import { Popup } from '@/components/ui/Popup'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ServerCrash } from 'lucide-react'   // ← Added Lucide icon

const ServerErrorPopup = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("server-error", handler)
    return () => window.removeEventListener("server-error", handler)
  }, [])

  return (
    <Popup
      isOpen={open}
      closeModal={() => setOpen(false)}
    >
      {/* Icon placed at the top of the content */}
      <div className="flex flex-col items-center justify-center text-center py-6 px-4">
        {/* Icon container */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border border-red-100 shadow-sm mb-4">
          <ServerCrash className="w-8 h-8 text-red-500" />
        </div>

        {/* Title (optional but improves UX a lot) */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          {t('errors:500.title')}
        </h2>

        {/* Description */}
        <p className="text-center text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
          {t('errors:500.description')}
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button
          onClick={() => window.location.reload()}
          size="md"
          fullWidth
        >
          {t("buttons:reload")}
        </Button>
        <Button
          onClick={() => setOpen(false)}
          variant="cancel"
          size="md"
          fullWidth
        >
          {t("buttons:close")}
        </Button>
      </div>
    </Popup>
  )
}

export default ServerErrorPopup