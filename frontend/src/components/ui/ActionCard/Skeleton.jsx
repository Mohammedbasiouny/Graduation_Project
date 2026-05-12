import clsx from "clsx";

const ActionCardSkeleton = () => {
  return (
    <div
      className={clsx(
        "w-full min-h-47.5 bg-white rounded-2xl border border-(--gray-light) shadow-md",
        "flex flex-col gap-5 justify-between p-5 animate-pulse"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />

        {/* Title + Description */}
        <div className="flex-1">
          <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
          <div className="h-3 w-full bg-gray-200 rounded-md mt-2" />
          <div className="h-3 w-4/5 bg-gray-200 rounded-md mt-1" />
        </div>
      </div>

      {/* Footer / Button */}
      <div className="h-10 w-36 bg-gray-200 rounded-lg" />
    </div>
  );
};

export default ActionCardSkeleton;
