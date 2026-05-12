import { AlertTriangle, Pyramid } from 'lucide-react'
import React from 'react'
import Alert from '@/components/ui/Alert/Alert'
import { useTranslation } from 'react-i18next';

const NotesSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <Alert 
        icon={Pyramid}
        type='info'
        dismissible={false}
        title={t("egypt:notes.administrative_division.title")}
        collapsible
        defaultCollapsed
      >
        <p
          className={`
            whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
          `}
        >
          {t("egypt:notes.administrative_division.description")}
        </p>
      </Alert>

      <Alert 
        icon={AlertTriangle}
        type='warning'
        dismissible={false}
        title={t("egypt:notes.selection_rules.title")}
        collapsible
        defaultCollapsed
      >
        <p
          className={`
            whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
          `}
        >
          {t("egypt:notes.selection_rules.description")}
        </p>
      </Alert>
    </>
  )
}

export default NotesSection
