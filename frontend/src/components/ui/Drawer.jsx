import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import { usePortal } from "@/hooks/use-portal.hook";
import BackDrop from "./BackDrop";

const Drawer = ({
  open = false,
  onClose,
  children,
  bg = "bg-white",
  position = "left", // left | right | top | bottom
  width = "max-w-[340px] min-w-[340px]",
  height = "h-[300px]",
}) => {
  const portalEl = usePortal("drawer-root");
  if (!portalEl) return null;

  const positionClasses = {
    left: clsx(
      "top-0 left-0 h-full",
      width,
      open ? "translate-x-0" : "-translate-x-full"
    ),

    right: clsx(
      "top-0 right-0 h-full",
      width,
      open ? "translate-x-0" : "translate-x-full"
    ),

    top: clsx(
      "top-0 left-0 w-full",
      height,
      open ? "translate-y-0" : "-translate-y-full"
    ),

    bottom: clsx(
      "bottom-0 left-0 w-full",
      height,
      open ? "translate-y-0" : "translate-y-full"
    ),
  };

  return createPortal(
    <>
      <div
        className={clsx(
          "fixed z-9998 transform transition-transform duration-300 ease-in-out shadow-lg",
          bg,
          positionClasses[position]
        )}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 overflow-auto h-full">
          {children}
        </div>
      </div>
      <BackDrop open={open} onClose={onClose} />
    </>,
    portalEl
  );
};

export default Drawer;