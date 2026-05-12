import { cloneElement, isValidElement, memo } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "./button-variants";

const Button = ({
  size = "lg",
  variant = "primary",
  shape = "rounded",
  fullWidth = false,
  isLoading = false,
  icon,
  iconInLeft = false,
  className,
  children,
  ...rest
}) => {
  const iconSizeMap = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };
  const iconSize = iconSizeMap[size || "lg"];

  const renderedIcon = !isLoading && isValidElement(icon)
    ? cloneElement(icon, { size: iconSize })
    : null;

  const hasChildren = Boolean(children);

  // If the button has only an icon, allow it to shrink and remove min-width
  const shrinkButton = !hasChildren && renderedIcon;

  return (
    <button
      className={clsx(
        buttonVariants({ variant, size, shape, fullWidth }),
        shrinkButton && "min-w-0 w-auto px-2", // override width for icon-only
        className
      )}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={iconSize} className="animate-spin" />
          {hasChildren && <span>{children}</span>}
        </div>
      ) : (
        <div
          className={clsx("flex items-center justify-center", {
            "gap-2": hasChildren && renderedIcon, // only add gap if both icon & text exist
          })}
        >
          {iconInLeft && renderedIcon}
          {hasChildren && <span>{children}</span>}
          {!iconInLeft && renderedIcon}
        </div>
      )}
    </button>
  );
};

export default memo(Button);
