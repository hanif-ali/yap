"use client";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";

export const TopBar = () => {
  const { state: sidebarState } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-[var(--chat-border)] bg-[var(--chat-background)] bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none ",
          {
            "sm:translate-y-3.5 sm:rounded-tl-xl": sidebarState === "expanded",
          }
        )}
      >
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>
      <div
        className={cn(
          "absolute inset-x-3 top-0 z-9 box-content overflow-hidden border-0 bg-gradient-noise-top backdrop-blur-md transition-all ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5",
          {
            "sm:translate-y-[-15px] sm:rounded-tl-xl": sidebarState === "collapsed",
          }
        )}
      >
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
        <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>
      </div>
    </>
  );
};
