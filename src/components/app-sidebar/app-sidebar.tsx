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
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 mb-4">
          <Link
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm"
            href="/"
            data-discover="true"
          >
            <span
              className="w-full select-none text-center"
              data-state="closed"
            >
              New Chat
            </span>
          </Link>
        </div>
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
