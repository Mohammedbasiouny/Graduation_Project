import React from "react"

const InfoCard = ({ label, value, children }) => {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-gray-300 pb-2`}
    >
      {/* Label / Question */}
      <span className="text-gray-800 text-lg font-medium">{label}</span>

      {/* Value / Answer */}
      {value && (
        <span className="text-gray-900 text-base font-semibold">{value}</span>
      )}

      {/* Optional Children */}
      {children && <div className="">{children}</div>}
    </div>
  )
}

export default InfoCard