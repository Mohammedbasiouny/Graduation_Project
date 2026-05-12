// src/hooks/use-scroll-to-top.hook.js
import { useEffect } from "react";
import { useLocation } from "react-router";

const useScrollToTop = (behavior = "smooth") => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [pathname, behavior]);
};

export default useScrollToTop;
