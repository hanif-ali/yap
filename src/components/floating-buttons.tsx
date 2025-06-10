"use client";

import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { Plus, Search, Settings } from "lucide-react";
import { Sun } from "lucide-react";

export function FloatingButtons() {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        "fixed top-2 left-1 flex items-center gap-0.5 z-50 transition-all duration-300 ease-in-out rounded-md p-1",
        state === "collapsed" ? "bg-sidebar" : "bg-transparent"
      )}
    >
      <SidebarTrigger className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground" />
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
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
