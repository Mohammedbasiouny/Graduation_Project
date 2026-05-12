import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language || "en";
    const html = document.documentElement;

    html.lang = currentLang;
    html.dir = currentLang === "ar" ? "rtl" : "ltr";
    
    html.classList.remove("font-ar", "font-en");
    html.classList.add(currentLang === "ar" ? "font-ar" : "font-en");
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    const namespaces = i18n.options.ns;
  
    const missing = namespaces.filter((n) => !i18n.hasResourceBundle(lng, n));
    if (missing.length > 0) {
      console.warn(
        `Some namespaces missing for "${lng}": ${missing.join(", ")}`
      );
    }
  
    i18n.changeLanguage(lng);
    localStorage.setItem(import.meta.env.VITE_I18N_LANGUAGE_STORAGE_KEY || "i18nextLng", lng);
  };
  
  const currentLang = i18n.language || "en";
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  return {
    i18n,
    currentLang: currentLang,
    changeLanguage,
    isArabic,
    dir,
  };
}
