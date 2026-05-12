import { useEffect, useState } from "react";

export function usePortal(id = "portal-root") {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    let element = document.getElementById(id);

    // If portal doesn't exist → create it
    if (!element) {
      element = document.createElement("div");
      element.id = id;
      document.body.appendChild(element);
    }

    setPortalElement(element);

    // Cleanup (optional)
    return () => {
      // If YOU created the portal, remove it on unmount
      if (!document.getElementById(id)) {
        element.remove();
      }
    };
  }, [id]);

  return portalElement;
}
