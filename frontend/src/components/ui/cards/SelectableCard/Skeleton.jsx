import { memo } from "react";

const SelectableCardSkeleton = () => {
  return (
    <div
      className="
        w-full bg-white rounded-2xl border border-gray-200
        p-4 sm:p-6 shadow-md animate-pulse
      "
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:ltr:text-left sm:rtl:text-right">
        
        {/* Title + Description */}
        <div className="flex flex-col gap-3 max-w-full sm:max-w-lg w-full">
          {/* Title */}
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-5 sm:h-6 w-40 bg-gray-200 rounded" />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>

        {/* Icon Badge */}
        <div
          className="
            flex items-center justify-center
            w-14 h-14 sm:w-16 sm:h-16
            rounded-full bg-gray-200
          "
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-300 rounded" />
        </div>

      </div>
    </div>
  );
};

export default memo(SelectableCardSkeleton);