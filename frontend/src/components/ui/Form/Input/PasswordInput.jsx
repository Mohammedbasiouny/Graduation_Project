import { forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import ErrorText from "../ErrorText";

const PasswordInput = forwardRef(
  (
    {
      className = "",
      error = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {/* Input Wrapper */}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            className={clsx(
              "w-full rounded-lg border focus:ring-[1px] text-[16px] md:text-[18px] text-black placeholder-gray-400 outline-none transition-all duration-150 ltr:pr-10 rtl:pl-10", // padding right for icon
              "h-[42px] md:h-[50px]",
              "px-3 py-2 md:px-4 md:py-3",
              "disabled:opacity-60 disabled:bg-(--gray-lightest) disabled:cursor-not-allowed",
              error
              ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
              : "border-(--gray-light) bg-white focus:ring-(--gold-main) focus:border-(--gold-main)",
              className
            )}
            {...rest}
          />

          {/* Toggle Password Visibility */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-(--gray-dark) hover:text-(--primary-dark) transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorText error={error} />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "input";

export default PasswordInput;
