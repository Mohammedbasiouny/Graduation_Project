import { Play, Square } from "lucide-react";
import { positionClasses } from ".";

const CameraControllers = ({ openCamera, stopStream, isRunning, position = 'bottom-center'  }) => {
  return (
    <div className={`absolute ${positionClasses[position]} -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-lg backdrop-blur cursor-pointer`}>

      {/* START */}
      {!isRunning && (
        <button
          onClick={openCamera}
          className="text-white hover:text-green-400 transition cursor-pointer"
        >
          <Play size={26} />
        </button>
      )}

      {/* STOP */}
      {isRunning && (
        <button
          onClick={stopStream}
          className="text-white hover:text-red-500 transition cursor-pointer"
        >
          <Square size={26} />
        </button>
      )}

    </div>
  )
}

export default CameraControllers