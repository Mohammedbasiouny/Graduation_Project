import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      user: {
        id: null,
        name: null,
        role: null,
        university: null,
        permissions: [],
      },
      isAuthenticated: false,

      setAuth: ({ token, expiresAt, id, name, role, university, permissions }) =>
        set({
          token,
          expiresAt,
          user: {
            id,
            name,
            role,
            university,
            permissions,
          },
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          token: null,
          expiresAt: null,
          user: {
            id: null,
            name: null,
            role: null,
            university: null,
            permissions: [],
          },
          isAuthenticated: false,
        })

        window.location.reload()
      },

      // Helper: check if expired
      isTokenExpired: () => {
        const expiresAt = get().expiresAt;
        if (!expiresAt) return true;
        return Date.now() > expiresAt;
      },
    }),
    {
      name: import.meta.env.VITE_AUTH_STORAGE_KEY || "auth-storage",
    }
  )
);
