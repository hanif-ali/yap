"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { FloatingButtons } from "@/components/floating-buttons";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen text-white">
      <SidebarProvider>
        <FloatingButtons />
        <AppSidebar />
        {children}
      </SidebarProvider>
    </div>
  );
}
