import { useLanguage } from '@/i18n/use-language.hook';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Link } from 'react-router';
import { useLoadingScreen } from '@/store/use-loading-screen-store';

const TopBar = ({ lightMode = false }) => {
  const { currentLang, changeLanguage } = useLanguage();
  const { t } = useTranslation()
  const { showLoading } = useLoadingScreen();

  const langBtn = (lang) => (
    <button
      onClick={() => { 
        showLoading(2);
        setTimeout(() => {
          changeLanguage(lang);
        }, 300);
      }}
      className={`cursor-pointer uppercase transition-colors duration-150 ${
        currentLang === lang
          ? "text-(--gold-main) cursor-default"
          : "hover:text-(--gold-main)"
      }`}
      disabled={currentLang === lang}
    >
      {t(lang)}
    </button>
  )

  return (
    <header 
      className={`text-[12px] sm:text-[18px] font-bold w-full h-fit px-[5%] py-2.5 ${lightMode ? "bg-white text-(--primary-dark)" : "bg-(--primary-dark) text-white"} flex items-center justify-between`}
      aria-label="Top bar"
    >
      <Link to={"/"}>
        <p className='tracking-wide'>
          {t("web_site_name")}
        </p>
      </Link>
      <div className='flex items-center gap-3'>
        {langBtn("en")}
        <Languages size={18} />
        {langBtn("ar")}
      </div>
    </header>
  )
}

export default TopBar
