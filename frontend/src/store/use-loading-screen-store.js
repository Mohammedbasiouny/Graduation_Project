import { create } from "zustand";

export const useLoadingScreen = create((set) => ({
  isLoading: false,
  time: 4,        // default time
  fadeIn: true,   // default fade-in effect

  showLoading: (time = 4, fadeIn = true) =>
    set({ isLoading: true, time, fadeIn }),

  hideLoading: () => set({ isLoading: false }),
}));
