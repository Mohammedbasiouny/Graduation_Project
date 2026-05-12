import { forwardRef } from "react";
import clsx from "clsx";
import ErrorText from "../ErrorText";

const Switch = forwardRef(
  (
    {
      label = "",
      error = "",
      disabled = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          {/* Switch Container */}
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              ref={ref}
              disabled={disabled}
              className={clsx("peer sr-only", className)}
              {...rest}
            />

            {/* Switch Track */}
            <div
              className={clsx(
                "w-11 h-6 rounded-full border transition-all duration-200 cursor-pointer",
                "peer-focus:ring-2 peer-focus:ring-offset-2",
                error
                  ? "border-red-500 peer-focus:ring-red-500"
                  : "border-(--gray-light) peer-focus:ring-(--gold-main)",
                disabled
                  ? "bg-(--gray-lightest) cursor-not-allowed opacity-60"
                  : "bg-(--gray-light) peer-checked:bg-(--gold-main)"
              )}
            />

            {/* Switch Thumb */}
            <div
              className={clsx(
                "absolute ltr:left-0.5 rtl:right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200",
                "ltr:peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5",
                disabled && "opacity-70"
              )}
            />
          </div>

          {/* Label */}
          {label && (
            <span className="text-base md:text-lg font-medium leading-tight text-(--primary-dark)">
              {label}
            </span>
          )}
        </label>

        {/* Error Text */}
        {error && <ErrorText error={error} />}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;