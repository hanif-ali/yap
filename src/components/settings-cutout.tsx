import { useState } from "react";
import { ThemeSelector } from "./themes/theme-selector";
import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export const SettingsCutout = () => {
  return (
    <div
      className="fixed right-3 top-3 z-50 pointer-events-auto"
      style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}
    >
      <div className="flex flex-row items-center bg-gradient-noise-top text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
        <Button
          asChild
          className="h-9 w-9 bg-transparent inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 rounded-bl-xl"
        >
          <Link href="/settings">
            <Settings2 className="size-4" />
          </Link>
        </Button>
        <ThemeSelector />
      </div>
    </div>
  );
};
