"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Ctx = { theme: "dark" | "light"; toggle: () => void };
const ThemeCtx = createContext<Ctx>({ theme: "dark", toggle: () => {} });
export function useTheme() { return useContext(ThemeCtx); }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark"|"light">("dark"); // default dark
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark"|"light") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
