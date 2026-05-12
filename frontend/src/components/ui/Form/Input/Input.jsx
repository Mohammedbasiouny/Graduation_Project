import { forwardRef } from "react";
import clsx from "clsx";
import ErrorText from "../ErrorText";

const Input = forwardRef(
  (
    {
      className = "",
      error = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <input
          ref={ref}
          disabled={disabled}
          className={clsx(
            "w-full rounded-lg border focus:ring-[1px] text-[16px] md:text-[18px] text-black placeholder-gray-400 outline-none transition-all duration-150",
            "h-10.5 md:h-12.5",
            "px-3 py-2 md:px-4 md:py-3",
            "disabled:opacity-60 disabled:bg-(--gray-lightest) disabled:cursor-not-allowed",
            error
              ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
              : "border-(--gray-light) bg-white focus:ring-(--gold-main) focus:border-(--gold-main)",
            className
          )}
          {...rest}
        />
        {error && (
          <ErrorText error={error} />
        )}
      </div>
    );
  }
);

Input.displayName = "input";

export default Input;
