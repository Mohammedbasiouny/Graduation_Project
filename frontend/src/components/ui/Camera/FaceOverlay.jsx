import { useEffect, useRef } from "react";

function FaceOverlay({ videoRef, faces = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef?.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      const width = video.clientWidth;
      const height = video.clientHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      if (!video.videoWidth || !video.videoHeight) return;

      const scaleX = width / video.videoWidth;
      const scaleY = height / video.videoHeight;

      faces.forEach((face) => {
        const { left, top, right, bottom } = face.bounding_box;

        const x = left * scaleX;
        const y = top * scaleY;

        const boxWidth = (right - left) * scaleX;
        const boxHeight = (bottom - top) * scaleY;

        const isUnknown =
          face.student_id === null || face.full_name === null;

        ctx.strokeStyle = isUnknown ? "red" : "lime";
        ctx.lineWidth = 3;

        ctx.strokeRect(x, y, boxWidth, boxHeight);

        ctx.fillStyle = isUnknown ? "red" : "lime";
        ctx.font = "14px Arial";

        ctx.fillText(
          `${face.full_name || "Unknown"} (${(
            face.confidence * 100
          ).toFixed(0)}%)`,
          x,
          y - 5
        );
      });
    };

    draw();
  }, [faces, videoRef]);

  return (
    <canvas className="absolute top-0 left-0 w-full h-full pointer-events-none" ref={canvasRef} />
  );
}

export default FaceOverlay;