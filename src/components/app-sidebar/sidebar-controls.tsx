"use client";

import { Search } from "lucide-react";
import Link from "next/link";

export function SidebarControls() {
  return (
    <>
      <div className="p-4 mb-4">
        <Link
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm"
          data-discover="true"
          href="/"
        >
          New Chat
        </Link>
      </div>
      <div className="border-b border-chat-border mb-4">
        <div className="flex items-center px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            role="searchbox"
            aria-label="Search threads"
            placeholder="Search your threads..."
            className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}
