import { memo } from "react";
import clsx from "clsx";

const SelectableCard = ({ 
  title, 
  description, 
  icon: Icon,
  selected = false,
  isError = false, // <-- added prop
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={clsx(
        `
          w-full bg-white rounded-2xl border p-4 sm:p-6
          transition-all duration-300 cursor-pointer
          hover:shadow-xl
        `,
        selected
          ? "border-(--gold-main) shadow-lg ring-(--gold-main)30]"
          : "border-gray-200 shadow-md",
        isError && "border-red-500 bg-red-50"
      )}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:ltr:text-left sm:rtl:text-right">

        {/* Title + Description */}
        <div className="flex flex-col gap-2 max-w-full sm:max-w-lg w-full">
          <h2
            className={clsx(
              "text-lg sm:text-xl font-semibold flex items-center gap-2 justify-center sm:justify-start",
              isError ? "text-red-600" : "text-gray-800"
            )}
          >
            {Icon && (
              <Icon
                className={clsx(
                  "w-5 h-5",
                  selected ? "text-(--gold-main)" : isError ? "text-red-600" : "text-gray-400"
                )}
              />
            )}
            {title}
          </h2>

          <p className={clsx("text-sm sm:text-base leading-snug", isError ? "text-red-500" : "text-gray-600")}>
            {description}
          </p>
        </div>

        {/* Icon Badge */}
        {Icon && (
          <div
            className={clsx(
              `
                flex items-center justify-center
                w-14 h-14 sm:w-16 sm:h-16
                rounded-full
                transition-all duration-300
              `,
              selected
                ? "bg-(--gold-main) text-white"
                : isError
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500"
            )}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        )}

      </div>
    </div>
  );
};

export default memo(SelectableCard);
