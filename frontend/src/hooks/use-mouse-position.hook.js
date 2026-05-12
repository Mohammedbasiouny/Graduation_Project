import { useState, useCallback } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    position,
    handleMouseMove,
    reset,
  };
}
