import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({

      user: null,
      role: null,

      setUser: (userData) =>
        set({
          user: userData,
          role: userData?.role || null,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
        }),

    }),
    {
      name: "sipera-auth",
    }
  )
);

export default useAuthStore;