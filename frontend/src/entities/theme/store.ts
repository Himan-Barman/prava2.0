import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: "prava-theme-storage",
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on app load
        if (state) applyTheme(state.theme);
      },
    }
  )
);

// 🛠️ The Logic that updates HTML instantly
const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.remove("light", "dark");
  root.classList.add(isDark ? "dark" : "light");
};

// 👂 System Listener (Auto-update when OS changes)
if (typeof window !== "undefined") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        const { theme } = useThemeStore.getState();
        if (theme === "system") {
            applyTheme("system");
        }
    });
}