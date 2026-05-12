import { create } from "zustand";

export const useLayoutStore = create((set) => ({
  showTopBar: true,
  setShowTopBar: (value) => set({ showTopBar: value }),

  showNavbar: true,
  setShowNavbar: (value) => set({ showNavbar: value }),

  showFooter: true,
  setShowFooter: (value) => set({ showFooter: value }),

  showCopyright: true,
  setShowCopyright: (value) => set({ showCopyright: value }),
  
  showBreadcrumbs: true,
  setShowBreadcrumbs: (value) => set({ showBreadcrumbs: value }),
  
  resetLayout: () => set({ showTopBar: true, showNavbar: true, showFooter: true, showCopyright: true, showBreadcrumbs: true }),
}));
