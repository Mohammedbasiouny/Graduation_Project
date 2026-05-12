import Camera from "./Camera";
import CameraControllers from "./CameraControllers";
import CameraTimer from "./CameraTimer";
import FaceAlerts from "./FaceAlerts";
import FaceOverlay from "./FaceOverlay";
import CameraAxisGuide from "./CameraAxisGuide";
import EnrollmentProgressBox from "./EnrollmentProgressBox";
import CameraOverlay from "./CameraOverlay";

const positionClasses = {
  'top-left': 'top-2 left-2',
  'top-center': 'top-2 left-1/2 -translate-x-1/2',
  'top-right': 'top-2 right-2',

  'center-left': 'top-1/2 left-2 -translate-y-1/2',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'top-1/2 right-2 -translate-y-1/2',

  'bottom-left': 'bottom-2 left-2',
  'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-2 right-2',
}
const statusEnrollmentColors = {
  collecting: "bg-emerald-400",
  success: "bg-green-500",
  reject: "bg-red-400",
  error: "bg-red-600",
  connecting: "bg-yellow-400",
  idle: "bg-gray-400",
}

export {
  Camera,
  CameraControllers,
  CameraTimer,
  FaceAlerts,
  FaceOverlay,
  CameraAxisGuide,
  EnrollmentProgressBox,
  CameraOverlay,
  positionClasses,
  statusEnrollmentColors
}