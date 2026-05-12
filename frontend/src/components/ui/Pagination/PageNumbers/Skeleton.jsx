const PageNumbersSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center gap-1 order-1 md:order-0">
      {/* 6–7 skeleton buttons */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="w-10 h-8 md:w-12 md:h-9 bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default PageNumbersSkeleton;
