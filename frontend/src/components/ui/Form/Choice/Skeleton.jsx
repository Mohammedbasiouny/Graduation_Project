import clsx from "clsx";

const ChoiceSkeleton = ({
  className = "",
  isCheckbox = false, // switch between round/checkbox skeleton
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Radio/Checkbox skeleton */}
        <div
          className={clsx(
            "bg-gray-200 animate-pulse",
            isCheckbox ? "h-[17px] w-[17px] rounded-sm" : "h-[17px] w-[17px] rounded-full",
            className
          )}
        ></div>

        {/* Label skeleton */}
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default ChoiceSkeleton;
