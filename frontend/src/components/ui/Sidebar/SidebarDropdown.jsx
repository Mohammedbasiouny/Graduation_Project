import { cloneElement } from "react";
import { ChevronDown } from "lucide-react";
import useCollapsible from "@/hooks/use-collapsible.hook";

const SidebarDropdown = ({ icon, name, children, defaultCollapsed = true }) => {
  const { collapsed, toggle, contentRef, maxHeight } = useCollapsible(
    defaultCollapsed,
    [children]
  );

  const clonedIcon = icon
    ? cloneElement(icon, {
        className:
          "w-[18px] h-[18px] transition-all duration-300 group-hover:scale-110",
      })
    : null;

  return (
    <div className="w-full">
      {/* Toggle */}
      <button
        type="button"
        onClick={toggle}
        className={`
          group relative flex items-center gap-4
          w-full px-5 py-3
          text-start
          ltr:rounded-r-lg rtl:rounded-l-lg
          transition-all duration-300 ease-out
          cursor-pointer

          ${
            collapsed
              ? "text-(--primary-dark) hover:text-black hover:bg-(--gray-lightest)/60"
              : "bg-(--gray-lightest) text-(--primary-dark)"
          }
        `}
      >
        {/* Soft hover layer */}
        <span className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

        {/* Active indicator (same as SidebarItem style) */}
        <span
          className={`
            absolute ltr:left-0 rtl:right-0
            top-1/2 -translate-y-1/2
            w-0.75 rounded-full
            transition-all duration-300

            ${
              !collapsed
                ? "h-full bg-(--gold-main)"
                : "h-0 group-hover:h-full bg-(--gold-main)/60"
            }
          `}
        />

        {/* Icon */}
        {clonedIcon && (
          <div className="relative z-10 text-(--primary-dark) group-hover:text-black transition-all duration-300">
            {clonedIcon}
          </div>
        )}

        {/* Text */}
        <span 
          className={`
            relative z-10
            ${!collapsed
              ? "font-bold"
              : "font-medium"
            } 
            text-[16px] leading-none tracking-wide flex-1 group-hover:text-(--primary-dark) whitespace-nowrap
          `}>
          {name}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={18}
          className={`
            relative z-10 transition-transform duration-300
            text-(--primary-dark)/60
            ${collapsed ? "" : "rotate-180"}
          `}
        />
      </button>

      {/* Children */}
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className={`
          mt-1 flex flex-col gap-2
          overflow-hidden transition-[max-height] duration-300 ease-in-out

          ltr:ml-4 rtl:mr-4
          ltr:pl-2 rtl:pr-2
          border-l-2 rtl:border-l-0 rtl:border-r-2
          border-(--gray-light)/40
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarDropdown;