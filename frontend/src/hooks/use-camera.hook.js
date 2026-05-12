import { useEffect, useRef, useCallback, useState } from "react";

export default function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const retryRef = useRef(null);
  const timerRef = useRef(null);

  const secondsRef = useRef(0);

  const [timer, setTimer] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);

  // ---------------------------
  // FORMAT TIME
  // ---------------------------
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ---------------------------
  // TIMER
  // ---------------------------
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    secondsRef.current = 0;
    setTimer("00:00:00");
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    secondsRef.current = 0;

    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setTimer(formatTime(secondsRef.current));
    }, 1000);
  }, []);

  // ---------------------------
  // STOP CAMERA
  // ---------------------------
  const stopStream = useCallback(() => {
    if (streamRef.current instanceof MediaStream) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    stopTimer();
    setIsRunning(false);
  }, [stopTimer]);

  // ---------------------------
  // START CAMERA (ONLY WHEN CALLED)
  // ---------------------------
  const openCamera = useCallback(async () => {
    try {
      stopStream();

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((d) => d.kind === "videoinput");

      let stream = null;

      for (const cam of cameras) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: cam.deviceId } },
            audio: false,
          });
          break;
        } catch {}
      }

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        setIsRunning(true);
        startTimer();
      }

      return true;
    } catch (err) {
      console.error("Camera error:", err);
      return false;
    }
  }, [stopStream, startTimer]);

  // ---------------------------
  // CLEANUP ONLY
  // ---------------------------
  useEffect(() => {
    return () => {
      stopStream();

      if (retryRef.current) {
        clearInterval(retryRef.current);
        retryRef.current = null;
      }
    };
  }, [stopStream]);

  // ---------------------------
  // API
  // ---------------------------
  return {
    videoRef,
    openCamera,
    stopStream,
    timer,
    isRunning,
  };
}