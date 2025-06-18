"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";

interface SidebarControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SidebarControls({ searchQuery, setSearchQuery }: SidebarControlsProps) {
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-4 mt-2 px-1">
      <div>
        <Link
          className="border-reflect inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm color-primary-foreground"
          data-discover="true"
          href="/"
        >
          New Chat
        </Link>
      </div>
      <div className="border-b border-[var(--chat-border)]">
        <div className="flex items-center px-3">
          <Search className="size-4 mr-3 text-muted-foreground" />
          <input
            role="searchbox"
            aria-label="Search threads"
            placeholder="Search your threads..."
            id="thread-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="ml-2 p-1 hover:bg-muted rounded-sm transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
