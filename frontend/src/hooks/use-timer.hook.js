import { useState, useEffect, useCallback } from "react";

export const useTimer = (initialTime = 120) => {
  const [timer, setTimer] = useState(initialTime);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (!isDisabled) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDisabled]);

  const resetTimer = useCallback(() => {
    setTimer(initialTime);
    setIsDisabled(true);
  }, [initialTime]);

  return { timer, isDisabled, resetTimer };
};
