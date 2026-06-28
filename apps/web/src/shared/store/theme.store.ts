import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: "light",

    setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");

        localStorage.setItem("theme", theme);

        set({ theme });
    },

    toggleTheme: () => {
        set((state) => {
            const nextTheme = state.theme === "light" ? "dark" : "light";

            document.documentElement.classList.toggle(
                "dark",
                nextTheme === "dark"
            );

            localStorage.setItem("theme", nextTheme);

            return {
                theme: nextTheme,
            };
        });
    },

    initializeTheme: () => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;

        const theme =
            savedTheme ??
            (window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light");

        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

        set({ theme });
    },
}));