import { useTranslation } from "react-i18next";

const Copyright = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-(--primary-dark) py-3 px-4 flex items-center justify-center text-center text-sm sm:text-base md:text-lg font-semibold text-white">
      {t("footer:copyright")}
    </footer>
  );
};

export default Copyright;
