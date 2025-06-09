import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { T3Logo } from "@/components/t3-logo";
import { ThreadHistory } from "./thread-history";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-8 items-center justify-center p-4">
          <a
            className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
            href="/"
            data-discover="true"
          >
            <div className="h-3.5 select-none">
              <T3Logo />
            </div>
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 mb-4">
          <a
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm"
            href="/"
            data-discover="true"
          >
            <span
              className="w-full select-none text-center"
              data-state="closed"
            >
              New Chat
            </span>
          </a>
        </div>
        <ThreadHistory />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t border-gray-700">
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
