import { create } from "zustand";

export const useSidebarStore = create()(
    (set, get) => ({
      isOpen: false,

      toggleSidebar: () => set({ isOpen: !get().isOpen }),

      setSidebar: (value) => set({ isOpen: value }),
    })
);
