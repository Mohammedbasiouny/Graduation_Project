import { memo, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/use-language.hook";
import { usePortal } from "@/hooks/use-portal.hook";
import { useTranslation } from "react-i18next";
import { useLoadingScreen } from "@/store/use-loading-screen-store";

const LanguageSwitcher = () => {
  const portalEl = usePortal("overlay-root");
  const { currentLang, changeLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { showLoading } = useLoadingScreen();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 150);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const toggleLang = useCallback(() => {
    showLoading(2);

    setTimeout(() => {
      changeLanguage(currentLang === "en" ? "ar" : "en");
    }, 300);
  }, [showLoading, currentLang, changeLanguage]);

  if (!portalEl) return null;

  return createPortal(
    <button
      aria-label="Change language"
      onClick={toggleLang}
      className={clsx(
        "fixed z-9999 flex items-center justify-center",
        "rounded-full shadow-lg transition-all duration-300 ease-out",
        "focus:outline-none cursor-pointer",

        // 📱 Smaller on mobile
        "w-9 h-9 bottom-4",

        // 📱➡️💻 Responsive scaling
        "sm:w-10 sm:h-10 sm:bottom-6",
        "md:w-12 md:h-12",

        // 📍 Responsive position (RTL / LTR)
        currentLang === "ar"
          ? "left-3 bottom-14 sm:left-17 md:left-19"
          : "right-3 bottom-14 sm:right-17 md:right-19",

        // 🎨 Brand color (fixed syntax)
        "bg-(--primary-dark) text-white",
        "hover:bg-black",

        // Visibility animation
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      {/* Icon */}
      <Languages
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
        strokeWidth={2.5}
      />

      {/* Language Badge */}
      <span
        className={clsx(
          "absolute rounded border font-bold",
          "bg-white text-black border-black",

          // 📱 Smaller badge on mobile
          "-top-2 px-1 py-0.5 text-[10px]",

          // Larger on bigger screens
          "sm:-top-2.5 sm:text-xs",
          "md:-top-3"
        )}
      >
        {t(currentLang)}
      </span>
    </button>,
    portalEl
  );
};

export default memo(LanguageSwitcher);