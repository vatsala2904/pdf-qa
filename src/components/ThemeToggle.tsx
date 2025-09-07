"use client";
import { useTheme } from "@/components/Theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="fixed right-4 top-4 rounded-full px-3 py-1 text-sm
                 bg-neutral-800 text-white dark:bg-white dark:text-black shadow"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
