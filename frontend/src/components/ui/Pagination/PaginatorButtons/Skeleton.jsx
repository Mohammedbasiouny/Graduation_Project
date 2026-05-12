const PaginatorButtonsSkeleton = () => {
  return (
    <div className="flex justify-center gap-2 order-2 md:order-0">
      {/* Previous button skeleton */}
      <div className="px-4 py-2 rounded-lg w-28 h-10 md:h-12 bg-gray-200 animate-pulse"></div>

      {/* Next button skeleton */}
      <div className="px-4 py-2 rounded-lg w-28 h-10 md:h-12 bg-gray-200 animate-pulse"></div>
    </div>
  );
};

export default PaginatorButtonsSkeleton;
