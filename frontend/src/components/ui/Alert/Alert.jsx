import { useState, useRef, useEffect, memo, useCallback } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cva } from "class-variance-authority";
import useCollapsible from "@/hooks/use-collapsible.hook";

const alertClasses = cva(
  "relative w-full border border-dashed shadow-md rounded-[10px] hover:shadow-lg transition-all duration-150 ease-in-out p-4 sm:p-4 md:p-5",
  {
    variants: {
      type: {
        info: "bg-(--blue-lightest) text-(--blue-dark) border-(--blue-light)",
        success: "bg-(--green-lightest) text-(--green-dark) border-(--green-light)",
        warning: "bg-(--yellow-lightest) text-(--yellow-dark) border-(--yellow-light)",
        error: "bg-(--red-lightest) text-(--red-dark) border-(--red-light)",
        default: "bg-(--gray-lightest) text-(--gray-dark) border-(--gray-light)",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

const buttonClasses = cva(
  "transition-colors cursor-pointer shrink-0",
  {
    variants: {
      variant: {
        default: "text-(--gray-dark) hover:text-(--primary-dark)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = ({
  type = "default",
  icon: Icon,
  title,
  description,
  children,
  dismissible = true,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const {
    collapsed,
    toggle,
    contentRef,
    maxHeight,
  } = useCollapsible(defaultCollapsed, [children, description]);

  const closeAlert = useCallback(() => setIsHidden(true), []);

  if (isHidden) return null;

  return (
    <div
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-label={`${type} alert`}
      className={alertClasses({ type })}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {Icon && <Icon size={23} />}
          <h2 className="text-base sm:text-lg md:text-xl font-semibold leading-snug">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Collapsible Button */}
          {collapsible && (
            <button
              onClick={toggle}
              type="button"
              aria-label="Toggle content"
              className={buttonClasses()}
            >
              {collapsed ? (
                <ChevronDown size={20} aria-hidden="true" />
              ) : (
                <ChevronUp size={20} aria-hidden="true" />
              )}
            </button>
          )}

          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={closeAlert}
              type="button"
              aria-label="Close alert"
              className={buttonClasses()}
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        {children ? (
          <div className="text-sm sm:text-base md:text-lg leading-relaxed mt-2 sm:mt-3 md:mt-4">
            {children}
          </div>
        ) : description ? (
          <p className="text-sm sm:text-base md:text-base font-medium text-(--gray-dark) mt-2 sm:mt-3 md:mt-4">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Alert);