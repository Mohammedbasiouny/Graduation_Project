import React from "react";
import clsx from "clsx";

export default function Tabs({ tabs = [] }) {
  return (
    <div className="relative w-full border-b border-(--primary-dark)/20">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-linear-to-r from-white to-transparent z-10" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-white to-transparent z-10" />

      <div
        className="
          flex items-center
          gap-4 sm:gap-6 lg:gap-8
          overflow-x-auto
          scrollbar-hide
          px-4
        "
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={tab.onClick}
            className={clsx(
              `
              relative pb-3
              text-xs sm:text-sm lg:text-base
              font-semibold
              whitespace-nowrap
              cursor-pointer
              transition-colors duration-300
              shrink-0
              `,
              tab.selected
                ? "text-(--navy-main)"
                : "text-(--primary-dark)/60 hover:text-(--navy-deep)"
            )}
          >
            {tab.text}

            {/* Animated Indicator */}
            <span
              className={clsx(
                `
                absolute left-0 right-0 -bottom-px
                h-0.75
                bg-(--gold-main)
                rounded-full
                transform
                transition-transform duration-300 ease-in-out
                `,
                tab.selected ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "center" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}