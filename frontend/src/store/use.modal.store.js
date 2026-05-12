import { create } from "zustand";

export const useModalStoreV2 = create((set, get) => ({
  modals: [],

  openModal: (name, data = null) => {
    const { modals } = get();

    const exists = modals.some((m) => m.name === name);
    if (exists) return;

    set({
      modals: [...modals, { name, data }],
    });
  },

  closeModal: (name) => {
    const { modals } = get();

    set({
      modals: modals.filter((m) => m.name !== name),
    });
  },

  closeAll: () => set({ modals: [] }),

  isOpen: (name) => get().modals.some((m) => m.name === name),
  getModalData: (name) =>
    get().modals.find((m) => m.name === name)?.data ?? null,
}));
