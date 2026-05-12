import { forwardRef } from "react";
import clsx from "clsx";
import ErrorText from "../ErrorText";

const Textarea = forwardRef(
  (
    {
      className = "",
      error = "",
      disabled = false,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <textarea
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={clsx(
            "w-full rounded-lg border focus:ring-[1px] text-[16px] md:text-[18px] text-black placeholder-gray-400 outline-none transition-all duration-150",
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

Textarea.displayName = "textarea";

export default Textarea;
