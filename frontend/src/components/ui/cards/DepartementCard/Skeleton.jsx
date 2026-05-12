const DepartmentCardSkeleton = () => {
  return (
    <div
      className="
        bg-white rounded-2xl border border-gray-200 shadow-sm
        p-6 flex flex-col gap-5
      "
    >
      {/* Top Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-3 w-full">
          {/* University name */}
          <div className="h-4 w-32 rounded-lg bg-gray-200 animate-pulse" />

          {/* Faculty name */}
          <div className="h-5 w-72 max-w-full rounded-lg bg-gray-200 animate-pulse" />

          {/* Department name */}
          <div className="h-8 w-56 max-w-full rounded-xl bg-gray-200 animate-pulse" />

          {/* Status badge */}
          <div className="h-7 w-32 rounded-full bg-gray-200 animate-pulse" />
        </div>

        {/* Actions placeholder */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default DepartmentCardSkeleton;
