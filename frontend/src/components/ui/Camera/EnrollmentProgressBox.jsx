import { positionClasses, statusEnrollmentColors } from "."

const EnrollmentProgressBox = ({ data = defaultData, position = 'top-left' }) => {
  const { framesCollected, framesRequired, status, message } = data

  const progress =
    framesRequired > 0
      ? (framesCollected / framesRequired) * 100
      : 0
  const color = statusEnrollmentColors[status] || "bg-emerald-400"
  return (
    <div
      className={`absolute ${positionClasses[position]} bg-black/70 backdrop-blur-md text-white p-4 rounded-xl shadow-xl w-64`}
      dir="ltr"
    >
      <div className="text-sm opacity-80">
        Enrollment Progress
      </div>

      <div className="text-lg font-semibold mt-1">
        {framesCollected} / {framesRequired}
      </div>

      {/* Progress */}
      <div dir="ltr" className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status */}
      <div className="mt-3 text-xs text-white/80 capitalize">
        {status}
      </div>

      {/* Message */}
      <div className="text-xs mt-1 text-white/70">
        {message}
      </div>
    </div>
  )
}

export default EnrollmentProgressBox