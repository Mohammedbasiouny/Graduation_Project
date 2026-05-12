import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const Flyout = ({ title, icon, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const flyoutRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={flyoutRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 ${className}`}
        aria-expanded={isOpen}
        aria-controls="flyout-menu"
      >
        {icon ?? (
          <>
            <span>{title}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Flyout Content */}
      {isOpen && (
        <div
          id="flyout-menu"
          className="absolute ltr:right-0 rtl:left-0 z-10 mt-2"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Flyout;
