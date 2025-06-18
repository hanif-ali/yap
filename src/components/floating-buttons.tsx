"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { Plus, Search } from "lucide-react";

export function FloatingButtons() {
  const { state, toggleSidebar } = useSidebar();

  const handleSearch = () => {
    toggleSidebar();
    document.getElementById("thread-search-input")?.focus();
  }

  return (
    <div
      className={cn(
        "fixed top-3 left-3 flex items-center gap-0.5 z-50 transition-all duration-300 ease-in-out rounded-md p-1",
        state === "collapsed" ? "bg-gradient-noise-top" : "bg-sidebar"
      )}
    >
      <SidebarTrigger className="h-9 w-9 transition-colors duration-200 hover:text-muted-foreground" />
      <div
        className={cn(
          "flex items-center gap-0.5 transition-all duration-300 ease-in-out",
          state === "expanded"
            ? "opacity-0 -translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground"
          asChild
        >
          <Link href="/">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
