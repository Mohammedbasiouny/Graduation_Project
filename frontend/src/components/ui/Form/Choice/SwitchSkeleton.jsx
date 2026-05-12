import clsx from "clsx";

const SwitchSkeleton = ({ className = "" }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {/* Switch Track skeleton */}
        <div
          className={clsx(
            "bg-gray-200 animate-pulse w-11 h-6 rounded-full relative",
            className
          )}
        >
          {/* Switch Thumb skeleton */}
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Label skeleton */}
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SwitchSkeleton;