import { useEffect, useRef, useState, useCallback } from "react";

export default function useRecognizeFaceSocket(videoRef, isRunning) {
  const wsRef = useRef(null);
  const stopRef = useRef(false);

  const [faces, setFaces] = useState([]);
  const ws_url = `${import.meta.env.VITE_WS_ATTENDANCE_URL}/recognize`;

  // ---------------------------
  // CONNECT
  // ---------------------------

  const connect = useCallback(() => {
    if (wsRef.current) return;

    const ws = new WebSocket(ws_url);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFaces(data.faces || []);
      } catch (e) {
        console.log(e);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, []);

  // ---------------------------
  // SEND FRAME
  // ---------------------------
  const sendFrame = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== 1) return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      if (!wsRef.current || wsRef.current.readyState !== 1) return;

      wsRef.current.send(blob);
    }, "image/jpeg", 0.7);
  }, [videoRef]);

  // ---------------------------
  // CONTROLLED LOOP (IMPORTANT)
  // ---------------------------

  const startLoop = useCallback(async () => {
    stopRef.current = false;

    connect();

    while (!stopRef.current) {
      sendFrame();

      // ⏱ WAIT BETWEEN REQUESTS (CHANGE THIS)
      await new Promise(res => setTimeout(res, 1000)); 
      // ↑ 1 second delay (you can change it to 2000, 3000 etc)
    }
  }, [connect, sendFrame]);

  const stopLoop = useCallback(() => {
    stopRef.current = true;
  }, []);

  // ---------------------------
  // EFFECT
  // ---------------------------

  useEffect(() => {
    if (!isRunning) {
      stopLoop();
      return;
    }

    startLoop();

    return () => {
      stopLoop();
    };
  }, [isRunning, startLoop, stopLoop]);

  // ---------------------------
  // CLEANUP
  // ---------------------------

  useEffect(() => {
    return () => {
      stopRef.current = true;
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { faces };
}