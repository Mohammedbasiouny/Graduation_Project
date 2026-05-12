import clsx from "clsx";
import { limitWords } from "@/utils/format-text.utils";

const Heading = ({
  title = "Default Title",
  subtitle = "",
  align = "center", // "left" | "center" | "right"
  color = "var(--primary-dark)",
  subtitleColor = "var(--gray-dark)",
  size = "md", // "sm" | "md" | "lg" | "xl"
  children,
}) => {
  // Map size to Tailwind text classes
  const titleSizes = {
    xs: "text-base md:text-lg lg:text-xl",
    sm: "text-lg md:text-xl lg:text-2xl",
    md: "text-2xl md:text-3xl lg:text-4xl",
    lg: "text-4xl md:text-5xl lg:text-6xl",
    xl: "text-5xl md:text-6xl lg:text-7xl",
  };

  const subtitleSizes = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
  };

  return (
    <div
      className={clsx(
        "flex flex-col w-full",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        align === "right" && "items-end text-right"
      )}
    >
      {/* Title */}
      <h2
        className={clsx(
          "font-bold tracking-tight leading-tight w-full",
          titleSizes[size]
        )}
        style={{ color }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={clsx(
            "mt-3 font-medium leading-tight w-full break-all",
            subtitleSizes[size]
          )}
          style={{ color: subtitleColor }}
        >
          {limitWords(subtitle, 8)}
        </p>
      )}

      {children}

      {/* Decorative line */}
      <div className="mt-3 h-0.75 w-max sm:w-32 rounded-full bg-(--gray-light)" />
    </div>
  );
};

export default Heading;
