import { memo } from "react";

const StepCard = ({ step, title, isActive = false, ...rest }) => {
  return (
    <button
      {...rest}
      className={`
        flex items-center gap-3 text-start w-full transition-all duration-200
        hover:bg-(--yellow-lightest) cursor-pointer
        ${isActive ? "bg-(--yellow-lightest) ltr:border-r-4 rtl:border-l-4 border-(--gold-main)" : ""}
      `}
    >
      {/* Step Number Circle with pulse */}
      <div
        className={`
          relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full font-semibold text-xs sm:text-sm
          ${isActive ? "bg-(--gold-main) text-white" : "bg-(--gray-dark) text-white"}
          shrink-0
        `}
      >
        {step}

        {/* Pulse ring */}
        {isActive && (
          <span
            className="absolute inline-flex w-full h-full rounded-full bg-(--gold-main) opacity-50 animate-ping"
          ></span>
        )}
      </div>

      {/* Title */}
      <span
        className={`
          text-gray-900 text-sm sm:text-lg font-medium
          ${isActive ? "text-(--gold-dark)" : "text-gray-800"}
        `}
      >
        {title}
      </span>
    </button>
  );
};

export default memo(StepCard);