const ChangeEmailSectionSkeleton = () => {
  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 animate-pulse'>
      {/* Heading */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Form */}
      <div className='mt-5 space-y-5'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>

        {/* Button */}
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ChangeEmailSectionSkeleton;