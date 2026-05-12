import { forwardRef } from "react";
import clsx from "clsx";
import ErrorText from "../ErrorText";

const Checkbox = forwardRef(
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
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className={clsx(
              "h-[17px] w-[17px] rounded-[10px] border cursor-pointer transition-all duration-150",
              "disabled:opacity-60 disabled:bg-(--gray-lightest) disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-(--gray-light) focus:ring-(--gold-main) focus:border-(--gold-main)",
              className
            )}
            {...rest}
          />

          {label && (
            <span className="text-base md:text-lg font-medium leading-tight text-(--primary-dark) ">
              {label}
            </span>
          )}
        </label>

        {error && (
          <ErrorText error={error} />
        )}
      </div>
    );
  }
);

Checkbox.displayName = "checkbox";

export default Checkbox;
