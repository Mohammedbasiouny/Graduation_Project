import React from "react";

const BuildingCardSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-(--gray-light) bg-white shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Gender icon */}
          <div className="w-12 h-12 rounded-2xl border border-(--gray-lightest) bg-(--gray-lightest) flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-md bg-(--gray-lightest) animate-pulse" />
          </div>

          {/* Title */}
          <div className="flex flex-col overflow-hidden min-w-0 w-full gap-2">
            <div className="h-5 w-[65%] sm:w-[45%] rounded-lg bg-(--gray-lightest) animate-pulse" />
            <div className="h-4 w-[45%] sm:w-[30%] rounded-lg bg-(--gray-lightest) animate-pulse" />
          </div>
        </div>

        {/* Manage icon */}
        <div className="w-10 h-10 rounded-xl border border-(--gray-lightest) flex items-center justify-center shrink-0">
          <div className="w-5 h-5 rounded-md bg-(--gray-lightest) animate-pulse" />
        </div>
      </div>

      {/* Availability badge */}
      <div>
        <div className="h-6 w-32 rounded-full bg-(--gray-lightest) animate-pulse" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Floors */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="h-4 w-20 rounded-lg bg-(--gray-lightest) animate-pulse" />
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>

        {/* Rooms */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="h-4 w-20 rounded-lg bg-(--gray-lightest) animate-pulse" />
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>

        {/* Premium rooms */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="h-4 w-28 rounded-lg bg-(--gray-lightest) animate-pulse" />
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>

        {/* Medical rooms */}
        <div className="rounded-xl border border-(--gray-lightest) bg-white p-3 flex flex-col gap-2">
          <div className="h-4 w-28 rounded-lg bg-(--gray-lightest) animate-pulse" />
          <div className="h-5 w-14 rounded-lg bg-(--gray-lightest) animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BuildingCardSkeleton;
