import { ArrowRight, Calendar, Clock, Utensils, Users } from "lucide-react";

const TodayMealCardSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-md p-6 flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center shrink-0" />

          {/* Title + Category + Description */}
          <div className="flex flex-col overflow-hidden gap-2 w-full">
            <div className="h-6 bg-gray-200 rounded w-3/5"></div>
            <div className="h-4 bg-gray-200 rounded w-2/5 mt-1"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-1"></div>
          </div>
        </div>

        {/* Today badge */}
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Delivery + Booking summary */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="h-6 bg-gray-200 rounded w-full md:w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-full md:w-1/2"></div>
      </div>

      {/* Stats / Date Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Notes */}
      <div className="h-12 bg-gray-200 rounded-xl"></div>
    </div>
  );
};

export default TodayMealCardSkeleton;