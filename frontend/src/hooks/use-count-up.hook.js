import { useEffect, useState } from "react";

/**
 * Counts from `start` to `end` over `duration` milliseconds.
 */
export default function useCountUp({ start = 0, end, duration = 2000 }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (end === undefined) return;

    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / range)) || 1;
    let current = start;
    const increment = end > start ? 1 : -1;

    const timer = setInterval(() => {
      current += increment;
      setCount(current);

      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return count;
}
