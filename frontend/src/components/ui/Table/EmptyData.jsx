import { TextSearch } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next';

const EmptyData = ({ emptyMessage = "" }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <TextSearch size={32} />
      <p className="text-center text-[18px]">{emptyMessage ? emptyMessage : t("no_data_available")}</p>
    </div>
  )
}

export default EmptyData
