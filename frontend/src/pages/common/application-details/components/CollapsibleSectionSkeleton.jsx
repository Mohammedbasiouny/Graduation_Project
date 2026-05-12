import React from "react"

const CollapsibleSectionSkeleton = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 md:p-10 animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-3 w-3/4">
          <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
        </div>

        <div className="w-5 h-5 bg-gray-200 rounded-md"></div>
      </div>

      {/* Content */}
      <div className="pt-8 space-y-4">
        <div className="h-4 bg-gray-100 rounded-md w-full"></div>
        <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-100 rounded-md w-4/6"></div>
        <div className="h-4 bg-gray-100 rounded-md w-3/6"></div>
      </div>
    </section>
  )
}

export default CollapsibleSectionSkeleton