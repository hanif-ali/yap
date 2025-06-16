"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <></>
    // <button
    //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    //   className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg z-50"
    //   aria-label="Toggle theme"
    // >
    //   {theme === "dark" ? (
    //     <Sun className="h-5 w-5 text-yellow-500" />
    //   ) : (
    //     <Moon className="h-5 w-5 text-gray-700" />
    //   )}
    // </button>
  );
} 