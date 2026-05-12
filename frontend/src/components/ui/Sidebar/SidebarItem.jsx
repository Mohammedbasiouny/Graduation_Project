import { NavLink } from "react-router";
import { useSidebarStore } from "@/store/use-sidebar.store";
import { cloneElement } from "react";

const SidebarItem = ({ name, icon, ...rest }) => {
  const { setSidebar } = useSidebarStore();

  const handleClick = () => setSidebar(false);

  const clonedIcon = icon
    ? cloneElement(icon, {
        className:
          "w-[18px] h-[18px] transition-all duration-300 group-hover:scale-110",
      })
    : null;

  return (
    <NavLink
      onClick={handleClick}
      {...rest}
      className={({ isActive }) =>
        `
        group relative flex items-center gap-4
        w-full px-5 py-3
        text-start
        ltr:rounded-r-lg rtl:rounded-l-lg
        transition-all duration-300 ease-out

        ${
          isActive
            ? "bg-(--gray-lightest) text-(--primary-dark)"
            : "text-(--primary-dark)/70 hover:text-(--primary-dark) hover:bg-(--gray-lightest)/60"
        }
      `
      }
    >
      {({ isActive }) => (
        <>
          {/* Soft hover layer */}
          <span
            className="
              absolute inset-0 rounded-lg
              bg-black/5
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          />

          {/* Active indicator */}
          <span
            className={`
              absolute ltr:left-0 rtl:right-0
              top-1/2 -translate-y-1/2
              w-0.75 rounded-full
              transition-all duration-300

              ${
                isActive
                  ? "h-full bg-(--gold-main)"
                  : "h-0 group-hover:h-full bg-(--gold-main)/60"
              }
            `}
          />

          {/* Icon */}
          {clonedIcon && (
            <div
              className="
                relative z-10
                text-(--primary-dark)/70
                group-hover:text-black
                transition-all duration-300
              "
            >
              {clonedIcon}
            </div>
          )}

          {/* Text (UX optimized) */}
          <span
            className={`
              relative z-10
              ${
                isActive
                  ? "font-bold"
                  : "font-medium"
              }
              text-[16px]
              leading-none
              tracking-wide
              text-(--primary-dark)
              group-hover:text-(--primary-dark)
              whitespace-nowrap
            `}
          >
            {name}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;