import { useState, useEffect, useCallback, memo } from "react";
import { CircleFadingArrowUp } from "lucide-react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { useLanguage } from "@/i18n/use-language.hook";
import { usePortal } from "@/hooks/use-portal.hook";

const ScrollToTop = () => {
  const portalEl = usePortal("overlay-root");
  const [isVisible, setIsVisible] = useState(false);
  const { currentLang } = useLanguage();

  // Show button after scrolling
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll action
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!portalEl) return null;

  return createPortal(
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={clsx(
        "fixed z-9999 flex items-center justify-center",
        "rounded-full shadow-lg transition-all duration-300 ease-out",
        "focus:outline-none cursor-pointer",

        "w-9 h-9 bottom-4",

        "sm:w-10 sm:h-10 sm:bottom-6",
        "md:w-12 md:h-12",

        currentLang === "ar"
          ? "left-3 sm:left-5 md:left-5"
          : "right-3 sm:right-5 md:right-5",

        "bg-(--primary-dark) text-white",
        "hover:bg-black",

        // Animation visibility
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <CircleFadingArrowUp
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
        strokeWidth={2.5}
      />
    </button>,
    portalEl
  );
};

export default memo(ScrollToTop);