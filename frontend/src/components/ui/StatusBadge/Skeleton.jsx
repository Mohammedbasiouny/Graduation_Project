import clsx from "clsx";

const StatusBadgeSkeleton = ({ size = "medium", shape = "rounded", fullWidth = false }) => {
  const baseClasses =
    "inline-flex items-center justify-center animate-pulse bg-(--gray-lightest) border border-(--gray-light)";

  const sizeClasses = {
    small: "h-6 w-20 sm:w-24",
    medium: "h-8 w-28 sm:w-32 md:w-36",
    large: "h-10 w-36 sm:w-40 md:w-44",
  };

  const shapeClasses = {
    square: "rounded-none",
    rounded: "rounded-[10px]",
    pill: "rounded-full",
  };

  return (
    <span
      className={clsx(
        baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        fullWidth && "w-full"
      )}
    ></span>
  );
};

export default StatusBadgeSkeleton;
