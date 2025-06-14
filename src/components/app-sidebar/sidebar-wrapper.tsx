"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
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
        <AppSidebar preloadedThreads={preloadedThreads} />
        {children}
      </SidebarProvider>
    </div>
  );
}
