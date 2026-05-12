import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Logos
import hu_logo from "@/assets/logos/HU_for_dark_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_dark_screen.png";
import hitu_logo from "@/assets/logos/HITU_for_dark_screen.png";
import udorm_logo from "@/assets/logos/white_UDORM_logo.png";
import ict_logo from "@/assets/logos/CICT.png";

import { usePortal } from "@/hooks/use-portal.hook";
import { useTranslation } from "react-i18next";
import { useLoadingScreen } from "@/store/use-loading-screen-store";

const logos = [hu_logo, hnu_logo, hitu_logo, udorm_logo, ict_logo];

export default function LoadingScreen() {
  const portalEl = usePortal("loading-root");
  const { t } = useTranslation();
  const { isLoading, time, fadeIn, hideLoading } = useLoadingScreen();

  const [progress, setProgress] = useState(0);
  const [currentLogo, setCurrentLogo] = useState(0);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  // Progress + auto hide
  useEffect(() => {
    if (!isLoading) return;

    setProgress(0);
    const totalMs = time * 1000;
    const intervalMs = 50;
    const increment = (intervalMs / totalMs) * 100;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p + increment >= 100) {
          clearInterval(interval);
          setTimeout(() => hideLoading(), 300);
          return 100;
        }
        return p + increment;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isLoading, hideLoading, time]);

  // Logo switching
  useEffect(() => {
    if (!isLoading) return;
    const switchMs = (time * 1000) / logos.length;
    const interval = setInterval(() => {
      setCurrentLogo((prev) => (prev + 1) % logos.length);
    }, switchMs);
    return () => clearInterval(interval);
  }, [isLoading, time]);

  if (!portalEl) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-9999 w-full h-screen flex flex-col items-center justify-center text-white 
                  bg-linear-to-br from-[#0d1224] via-[#0f1a35] to-[#0a0f1f]
                  transition-all duration-500
                  ${isLoading ? "block opacity-100" : "hidden opacity-0"} 
                  ${fadeIn ? "screen-fade" : ""}`}
    >
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[120px] animate-pulse-slow"></div>

      <div className="relative w-48 h-48 mb-10 rounded-full bg-white/10 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all duration-700 animate-bubble">
        {logos.map((logo, i) => (
          <img
            key={logo}
            src={logo}
            alt={`Logo ${i}`}
            loading="eager"
            className={`absolute w-32 h-32 object-contain transition-all duration-700
                        ${i === currentLogo ? "block opacity-100" : "hidden opacity-0"}`}
          />
        ))}
      </div>

      <div className="text-2xl md:text-3xl font-light tracking-wide mb-8 animate-fade-in-slow">
        {t("loading_your_experience")}
      </div>

      <div className="w-80 h-3 rounded-full bg-white/10 backdrop-blur-md overflow-hidden shadow-inner">
        <div
          className="h-full bg-(--gold-main) rounded-full transition-all duration-150 shadow-[0_0_20px_rgba(255,215,0,0.7)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>,
    portalEl
  );
}
