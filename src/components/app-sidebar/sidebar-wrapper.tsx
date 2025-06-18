"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { FloatingButtons } from "@/components/floating-buttons";
import { NoisyBackground } from "../backgrounds";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen text-white">
      <NoisyBackground />
      <SidebarProvider>
        <FloatingButtons />
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
