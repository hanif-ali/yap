"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { FloatingButtons } from "@/components/floating-buttons";
import { Preloaded } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

export function SidebarWrapper({ 
  children,
  preloadedThreads 
}: { 
  children: React.ReactNode;
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
}) {
  return (
    <div className="flex h-screen text-white">
      <SidebarProvider>
        <FloatingButtons />
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full min-h-screen"
        >
          <ResizablePanel 
            defaultSize={20} 
            minSize={15} 
            maxSize={35}
            className="min-w-[200px]"
          >
            <AppSidebar preloadedThreads={preloadedThreads} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  );
}
