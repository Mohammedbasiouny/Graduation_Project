const CollegeCardSkeleton = ({ ...rest }) => {
  return (
    <div
      className="
        bg-white rounded-2xl border border-gray-200 shadow-sm
        p-6 flex flex-col gap-5
      "
      {...rest}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-3 w-full">
          {/* University Name */}
          <div className="h-4 w-36 rounded-lg bg-gray-200 animate-pulse" />

          {/* College Name */}
          <div className="h-8 w-56 max-w-full rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* Status Badge */}
        <div className="h-7 w-28 rounded-full bg-gray-200 animate-pulse shrink-0" />
      </div>

      {/* Departments Count */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-40 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-5 w-10 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Actions placeholder */}
      <div className="flex gap-2">
        <div className="h-10 w-24 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-10 w-24 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-10 w-24 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
};

export default CollegeCardSkeleton;
