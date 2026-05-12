import clsx from "clsx";

const NormalSpinner = ({
  borderSize = "border-4",
  width = "w-14",
  height = "h-14",
  borderColor = "border-gray-300",
  borderTopColor = "border-t-[#b38e19]",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "rounded-full animate-spin",
        width,
        height,
        borderSize,
        borderColor,
        borderTopColor,
        className
      )}
    />
  );
};

export default NormalSpinner;
