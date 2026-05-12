import clsx from "clsx";

const VARIANT_STYLES = {
  blue: {
    bg: "bg-(--blue-lightest)",
    border: "border-(--blue-light)",
    text: "text-(--blue-dark)",
  },
  green: {
    bg: "bg-(--green-lightest)",
    border: "border-(--green-light)",
    text: "text-(--green-dark)",
  },
  yellow: {
    bg: "bg-(--yellow-lightest)",
    border: "border-(--yellow-light)",
    text: "text-(--yellow-dark)",
  },
  red: {
    bg: "bg-(--red-lightest)",
    border: "border-(--red-light)",
    text: "text-(--red-dark)",
  },
  gray: {
    bg: "bg-(--gray-lightest)",
    border: "border-(--gray-light)",
    text: "text-(--gray-dark)",
  },
};

const SIZE_STYLES = {
  sm: {
    wrapper: "min-h-[120px] p-4",
    icon: 28,
    label: "text-[16px]",
    value: "text-[28px]",
    subtext: "text-[13px]",
  },
  md: {
    wrapper: "min-h-[150px] p-5",
    icon: 34,
    label: "text-[18px]",
    value: "text-[32px]",
    subtext: "text-[14px]",
  },
  lg: {
    wrapper: "min-h-[170px] p-6",
    icon: 38,
    label: "text-[20px]",
    value: "text-[36px]",
    subtext: "text-[15px]",
  },
};

const CountCard = ({
  label = "Label",
  value = 0,
  icon: Icon,
  subtext = "",

  // ✅ NEW API
  variant = "gray",
  size = "md",

  className = "",
  ...rest
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.gray;
  const sizes = SIZE_STYLES[size] || SIZE_STYLES.md;


  return (
    <div
      className={clsx(
        "w-full rounded-2xl shadow-md border",
        "flex flex-col justify-between gap-4 transition",
        sizes.wrapper,
        styles.bg,
        styles.border,
        className
      )}
      {...rest}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex gap-3",
        )}
      >
        {Icon && (
          <Icon
            size={sizes.icon}
            className={clsx(styles.text, "shrink-0")}
          />
        )}

        <p className={clsx("font-bold leading-tight", sizes.label, styles.text)}>
          {label}
        </p>
      </div>

      {/* Value */}
      <div>
        <h2 className={clsx("font-bold leading-none", sizes.value, styles.text)}>
          {value}
        </h2>

        {subtext && (
          <p className={clsx("mt-2", sizes.subtext, styles.text)}>{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default CountCard;
