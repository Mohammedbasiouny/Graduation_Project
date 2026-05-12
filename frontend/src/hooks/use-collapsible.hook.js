import { useState, useRef, useEffect, useCallback } from "react";

const useCollapsible = (defaultCollapsed = false, dependencies = []) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [maxHeight, setMaxHeight] = useState(
    defaultCollapsed ? "0px" : "none"
  );
  const contentRef = useRef(null);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    if (!collapsed) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [collapsed, ...dependencies]);

  return {
    collapsed,
    toggle,
    contentRef,
    maxHeight,
  };
};

export default useCollapsible;