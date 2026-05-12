import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { limitWords } from "@/utils/format-text.utils";
import { usePortal } from "@/hooks/use-portal.hook";

const Tooltip = ({
  placement = "top",
  triggerType = "hover",
  content,
  children,
}) => {
  const portalEl = usePortal("overlay-root");
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);

  // ✅ Stable event handlers
  const show = useCallback(() => {
    if (triggerType !== "none") setIsVisible(true);
  }, [triggerType]);

  const hide = useCallback(() => {
    if (triggerType !== "none") setIsVisible(false);
  }, [triggerType]);

  const toggle = useCallback(() => {
    if (triggerType === "click") setIsVisible((prev) => !prev);
  }, [triggerType]);

  // ✅ Close on outside click (only for click-based tooltips)
  useEffect(() => {
    if (triggerType !== "click" || !isVisible) return;

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !targetRef.current?.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, triggerType]);

  // ✅ Compute position only when needed
  useEffect(() => {
    if (!isVisible || !targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    const offset = 8;
    const positions = {
      top: {
        top: targetRect.top - tooltipEl.offsetHeight - offset,
        left:
          targetRect.left + targetRect.width / 2 - tooltipEl.offsetWidth / 2,
      },
      bottom: {
        top: targetRect.bottom + offset,
        left:
          targetRect.left + targetRect.width / 2 - tooltipEl.offsetWidth / 2,
      },
      left: {
        top:
          targetRect.top + targetRect.height / 2 - tooltipEl.offsetHeight / 2,
        left: targetRect.left - tooltipEl.offsetWidth - offset,
      },
      right: {
        top:
          targetRect.top + targetRect.height / 2 - tooltipEl.offsetHeight / 2,
        left: targetRect.right + offset,
      },
    };

    setCoords(positions[placement] || positions.top);
  }, [isVisible, placement]);

  const arrowPosition = useMemo(
    () => ({
      top: "bottom-[-6px] left-1/2 -translate-x-1/2",
      bottom: "top-[-6px] left-1/2 -translate-x-1/2 -rotate-180",
      left: "top-1/2 right-[-6px] -translate-y-1/2 -rotate-90",
      right: "top-1/2 left-[-6px] -translate-y-1/2 -rotate-90",
    }),
    []
  );

  if (!portalEl) return null;
  
  return (
    <>
      <div
        ref={targetRef}
        className="inline-block"
        onMouseEnter={triggerType === "hover" ? show : undefined}
        onMouseLeave={triggerType === "hover" ? hide : undefined}
        onClick={toggle}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            <div className="relative px-3 py-1 text-xs text-white bg-black rounded-md shadow-md max-w-xs text-center whitespace-pre-line">
              {limitWords(content, 2)}
              <div
                className={clsx(
                  "absolute w-3 h-3 bg-black rotate-45",
                  arrowPosition[placement]
                )}
              />
            </div>
          </div>,
          portalEl
        )}
    </>
  );
};

export default memo(Tooltip);
