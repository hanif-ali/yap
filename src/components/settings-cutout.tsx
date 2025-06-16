import { useState } from "react";
import { ThemeSelector } from "./themes/theme-selector";

export const SettingsCutout = () => {
  return (
    <div
      className="fixed right-2 top-2 z-50 pointer-events-auto"
      style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}
    >
      <div className="flex flex-row items-center bg-gradient-noise-top text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 rounded-bl-xl"
          aria-label="Go to settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-settings2 size-4"
          >
            <path d="M20 7h-9"></path>
            <path d="M14 17H5"></path>
            <circle cx="17" cy="17" r="3"></circle>
            <circle cx="7" cy="7" r="3"></circle>
          </svg>
        </button>
        <ThemeSelector />
      </div>
    </div>
  );
};
