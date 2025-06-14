import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { T3Logo } from "@/components/t3-logo";
import { ThreadHistory } from "./thread-history";
import { Preloaded } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { SidebarControls } from "./sidebar-controls";

export function AppSidebar({
  preloadedThreads,
}: {
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-8 items-center justify-center p-4">
          <Link
            className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
            href="/"
            data-discover="true"
          >
            <div className="h-3.5 select-none">
              <T3Logo />
            </div>
          </Link>
        </div>
        <SidebarControls />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <ThreadHistory preloadedThreads={preloadedThreads} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-medium">
              H
            </div>
            <div>
              <div className="text-sm font-medium">Hanif Ali</div>
              <div className="text-xs text-gray-400">Free</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
