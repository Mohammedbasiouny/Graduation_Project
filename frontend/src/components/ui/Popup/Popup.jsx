import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { usePortal } from "@/hooks/use-portal.hook";

const Popup = ({ 
  isOpen, 
  closeModal, 
  title, 
  description, 
  fullWidth = false, 
  fullHeight = false,
  children 
}) => {
  const portalEl = usePortal("modal-root");
  const contentRef = useRef(null);

  // Prevent background scroll while keeping scrollbar visible
  useEffect(() => {
    const scrollY = window.scrollY;
  
    if (isOpen) {
      document.body.dataset.scrollY = scrollY;
      document.body.style.overflow = "hidden";
    } else {
      const oldScrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.overflow = "";
      window.scrollTo(0, oldScrollY);
    }
  }, [isOpen]);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeModal]);

  if (!portalEl) return null;

  return createPortal(
    <div
      className={` 
        fixed inset-0 bg-black/50 backdrop-blur-xs z-9997
        flex items-center justify-center p-3 sm:p-6
        transition-all duration-300 ease-in-out
        ${isOpen 
          ? "opacity-100 pointer-events-auto" 
          : "opacity-0 pointer-events-none"
        }
      `}
    >
      <div
        ref={contentRef}
        className={clsx(
          "w-full max-h-[90vh] sm:w-[90%]",
          fullWidth ? "md:w-[95%]" : "md:w-150",
          fullHeight ? "h-full" : "max-h-[90vh]",
          "overflow-auto rounded-[10px] p-5 bg-white",
          "shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col",
          "border border-(--gray-light) text-(--primary-dark)"
        )}
      >
        {title && (
          <h2 className="text-[18px] sm:text-[23px] font-bold mb-2 text-center ltr:sm:text-left rtl:sm:text-right text-(--primary-dark)">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-base font-medium mb-4 text-center ltr:sm:text-left rtl:sm:text-right text-(--gray-dark)">
            {description}
          </p>
        )}

        <div className="h-full mt-2">{children}</div>
      </div>
    </div>,
    portalEl
  );
};

export default Popup;