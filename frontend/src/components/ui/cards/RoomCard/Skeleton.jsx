import React from "react";

const RoomCardSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-(--gray-light) bg-white shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl border border-(--gray-lightest) bg-(--gray-lightest) flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-md bg-(--gray-lightest) animate-pulse" />
          </div>

          {/* Title + Badges */}
          <div className="flex flex-col overflow-hidden min-w-0 w-full gap-2">
            <div className="h-5 w-[65%] sm:w-[45%] rounded-lg bg-(--gray-lightest) animate-pulse" />

            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-(--gray-lightest) animate-pulse" />
              <div className="h-6 w-28 rounded-full bg-(--gray-lightest) animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Building info */}
      <div className="rounded-2xl border border-(--gray-lightest) bg-white p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-md bg-(--gray-lightest) animate-pulse shrink-0" />
            <div className="h-4 w-24 sm:w-28 rounded-lg bg-(--gray-lightest) animate-pulse" />
            <div className="h-4 w-[45%] sm:w-[35%] rounded-lg bg-(--gray-lightest) animate-pulse" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-(--gray-lightest) animate-pulse" />
            <div className="h-6 w-28 rounded-full bg-(--gray-lightest) animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Floor */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-(--gray-lightest) animate-pulse" />
            <div className="h-4 w-16 rounded-lg bg-(--gray-lightest) animate-pulse" />
          </div>
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>

        {/* Capacity */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-(--gray-lightest) animate-pulse" />
            <div className="h-4 w-20 rounded-lg bg-(--gray-lightest) animate-pulse" />
          </div>
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>

        {/* Type */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-(--gray-lightest) animate-pulse" />
            <div className="h-4 w-20 rounded-lg bg-(--gray-lightest) animate-pulse" />
          </div>
          <div className="h-5 w-24 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
