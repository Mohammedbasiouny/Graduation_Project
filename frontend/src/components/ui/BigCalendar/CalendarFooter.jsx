import { useTranslation } from "react-i18next";

const CalendarFooter = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-8 py-4 border-t border-zinc-200 bg-zinc-50 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="text-center sm:text-left">{t('calendar:click')}</div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-(--gold-main) rounded-full" />
          <span>{t('calendar:today')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 border-2 border-(--gold-main) rounded-full" />
          <span>{t('calendar:selected')}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarFooter;