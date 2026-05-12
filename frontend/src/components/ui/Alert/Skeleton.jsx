import { memo } from "react";

const AlertSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading alert"
      className="relative w-full border-2 border-dashed border-(--gray-light) bg-(--gray-lightest) shadow-sm rounded-xl p-3.5 sm:p-4 md:p-5 animate-pulse"
    >
      {/* Top Row: Icon + Title + Close Button */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon skeleton */}
          <div className="w-[22px] h-[22px] bg-(--gray-light) rounded-full" />

          {/* Title skeleton */}
          <div className="h-4 sm:h-5 md:h-6 w-32 sm:w-40 md:w-48 bg-(--gray-light) rounded-md" />
        </div>

        {/* Close (X) icon skeleton */}
        <div className="w-[22px] h-[22px] bg-(--gray-light) rounded-full" />
      </div>

      {/* Bottom Content: Description or Children skeleton */}
      <div className="mt-2 sm:mt-3 md:mt-4 space-y-2">
        <div className="h-3 sm:h-4 md:h-5 w-full bg-(--gray-light) rounded-md" />
        <div className="h-3 sm:h-4 md:h-5 w-5/6 bg-(--gray-light) rounded-md" />
      </div>
    </div>
  );
};

export default memo(AlertSkeleton);
