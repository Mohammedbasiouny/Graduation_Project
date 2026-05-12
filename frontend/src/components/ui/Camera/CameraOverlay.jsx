import { positionClasses } from "."

const CameraOverlay = ({
  children,
  position = "top-left",
  className = "",
}) => {
  return (
    <div
      className={`
        absolute
        ${positionClasses[position]}
        bg-black/70
        backdrop-blur-md
        text-white
        p-4
        rounded-xl
        shadow-xl
        w-64
        ${className}
      `}
      dir="ltr"
    >
      {children}
    </div>
  )
}

export default CameraOverlay