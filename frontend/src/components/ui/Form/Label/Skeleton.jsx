import clsx from "clsx";

const LabelSkeleton = ({ className = "", size = "md", centerText = false }) => {
  const sizeClasses = {
    sm: "h-3 w-16 md:w-20",
    md: "h-4 w-20 md:w-24",
    lg: "h-5 w-28 md:w-32",
  };

  return (
    <div
      className={clsx(
        "bg-(--gray-light) rounded animate-pulse",
        sizeClasses[size],
        centerText && "mx-auto",
        className
      )}
    ></div>
  );
};

export default LabelSkeleton;
