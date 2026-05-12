import { cva } from "class-variance-authority";
import clsx from "clsx";

const StatusBadgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-2",
    "font-semibold",
    "border",
    "transition-all",
    "duration-200",
    "select-none",
  ],
  {
    variants: {
      variant: {
        info: [
          "bg-(--blue-lightest)",
          "text-(--blue-dark)",
          "border-(--blue-light)",
          "hover:bg-(--blue-light)/30",
        ],
        success: [
          "bg-(--green-lightest)",
          "text-(--green-dark)",
          "border-(--green-light)",
          "hover:bg-(--green-light)/30",
        ],
        warning: [
          "bg-(--yellow-lightest)",
          "text-(--yellow-dark)",
          "border-(--yellow-light)",
          "hover:bg-(--yellow-light)/30",
        ],
        error: [
          "bg-(--red-lightest)",
          "text-(--red-dark)",
          "border-(--red-light)",
          "hover:bg-(--red-light)/30",
        ],
        default: [
          "bg-(--gray-lightest)",
          "text-(--gray-dark)",
          "border-(--gray-light)",
          "hover:bg-(--gray-light)/30",
        ],
      },
      size: {
        small: ["text-xs", "px-2", "py-0.5", "sm:text-sm", "sm:px-3", "sm:py-1"],
        medium: ["text-sm", "px-3", "py-1", "sm:text-base", "sm:px-4", "sm:py-1.5", "md:text-lg"],
        large: ["text-base", "px-4", "py-1.5", "sm:text-lg", "sm:px-5", "sm:py-2", "md:text-xl", "md:px-6", "md:py-2.5"],
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-[10px]",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full justify-center",
      },
      hasIcon: {
        true: "pl-1 pr-2",
        false: "px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
      shape: "rounded",
      fullWidth: false,
      hasIcon: false,
    },
  }
);

const StatusBadge = ({ variant, size, shape, fullWidth, icon: Icon, children, ...rest }) => {
  const hasIcon = Boolean(Icon);

  return (
    <div
      className={clsx(
        StatusBadgeVariants({ variant, size, shape, fullWidth, hasIcon }),
        "whitespace-nowrap"
      )}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
      {children && <span className="truncate">{children}</span>}
    </div>
  );
};

export default StatusBadge;
