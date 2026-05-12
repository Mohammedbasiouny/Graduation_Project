import white_UDORM_logo from "@/assets/logos/white_UDORM_logo.png";
import { useTranslation } from 'react-i18next';

const AuthHero = () => {
  const { t } = useTranslation();

  return (
    <div className="z-10 flex flex-col items-center text-center px-6 md:px-10">
      {/* Logo with subtle glow */}
      <div className="relative">
        <img
          src={white_UDORM_logo}
          alt="UDORM Logo"
          className="w-56 sm:w-72 md:w-80 lg:w-[400px] h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-transparent to-white/10 rounded-full blur-2xl opacity-60"></div>
      </div>

      <h1 className="relative bottom-[45px] font-bold tracking-tight text-white text-lg sm:text-xl md:text-2xl lg:text-3xl">
        {t("auth:hero_section.welcome")}
      </h1>

      <h2 className="relative bottom-[35px] text-white/80 text-sm sm:text-base md:text-lg italic">
        {t("auth:hero_section.slogan")}
      </h2>
    </div>
  )
}

export default AuthHero
