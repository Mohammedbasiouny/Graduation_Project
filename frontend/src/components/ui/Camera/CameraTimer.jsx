import { positionClasses } from "."

const CameraTimer = ({ timer, position = 'top-right' }) => {
  return (
    <div className={`absolute ${positionClasses[position]} bg-black/70 text-white px-3 py-1 rounded text-sm`}>
      {timer}
    </div>
  )
}

export default CameraTimer