import clsx from "clsx";
import { useTranslation } from "react-i18next";

const Label = ({
  className = "",
  size = "md",
  text,
  required = false,
  centerText = false,
  ...rest
}) => {
  const { t } = useTranslation();
  
  if (!text) return null;

  const sizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
  };

  return (
    <label
      className={clsx(
        "font-medium leading-tight text-(--primary-dark) flex items-center gap-1",
        centerText && "justify-center",
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      <span>{text}</span>
      {required ? (<span className="text-red-500">*</span>) : (<span>({t("optional")})</span>)}
    </label>
  );
};

Label.displayName = "label";

export default Label;
