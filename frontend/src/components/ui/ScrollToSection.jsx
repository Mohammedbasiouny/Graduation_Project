import { memo, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { usePortal } from "@/hooks/use-portal.hook";

const ScrollToSection = ({ targetId = "features", text = "Scroll" }) => {
  const portalEl = usePortal("overlay-root");
  const [isVisible, setIsVisible] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToSection = useCallback(() => {
    const section = document.getElementById(targetId);
    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start", // ✅ always top of section
    });
  }, [targetId]);

  // Hide button when section is visible
  useEffect(() => {
    const section = document.getElementById(targetId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [targetId]);

  // Detect top/bottom of section for arrow direction only
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(targetId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // If bottom of section is visible in viewport → show "up" arrow
      setIsAtBottom(rect.bottom <= windowHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  if (!portalEl) return null;
return createPortal(
  <button
    onClick={scrollToSection}
    aria-label="Scroll to section"
    className={clsx(
      "fixed left-1/2 bottom-4 z-9997",
      "-translate-x-1/2",
      "group",
      "flex items-center gap-3",

      // Size
      "w-max px-6 py-3",

      // 🔥 Brand linear background
      "rounded-full",
      "bg-linear-to-r from-(--navy-main) to-(--navy-deep)",

      // Text
      "text-white font-semibold tracking-wide",

      // Animation
      "transition-all duration-300 ease-out",
      "hover:scale-105",
      "active:scale-95",

      "cursor-pointer",

      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10 pointer-events-none"
    )}
  >
    {/* Icon Circle */}
    <span
      className="
        flex items-center justify-center
      "
    >
      {isAtBottom ? (
        <ChevronUp className="w-4 h-4 text-white" strokeWidth={2} />
      ) : (
        <ChevronDown className="w-4 h-4 text-white" strokeWidth={2} />
      )}
    </span>

    <span className="text-xs sm:text-sm">
      {text}
    </span>
  </button>,
  portalEl
);
};

export default memo(ScrollToSection);
