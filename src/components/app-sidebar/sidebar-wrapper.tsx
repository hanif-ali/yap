"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { FloatingButtons } from "@/components/floating-buttons";
import { Preloaded } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function SidebarWrapper({
  children,
  preloadedThreads,
}: {
  children: React.ReactNode;
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
}) {
  return (
    
    <div className="flex h-screen text-white">
      <SidebarProvider>
        <FloatingButtons />
        <div className="inset-0 dark:bg-[var(--sidebar-bg)] z-0 !fixed">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(closest-corner at 120px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9));",
            }}
          ></div>
          <div className="absolute inset-0 bg-noise z-100"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <AppSidebar preloadedThreads={preloadedThreads} />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
