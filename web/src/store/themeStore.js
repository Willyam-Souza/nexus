import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Guarda o tema em localStorage e aplica data-theme no <html> —
 * é essa mesma variável que o index.css usa para trocar as cores.
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        set({ theme: next });
      },
    }),
    {
      name: "@Nexus:theme",
      onRehydrateStorage: () => (state) => {
        if (state) document.documentElement.setAttribute("data-theme", state.theme);
      },
    }
  )
);
