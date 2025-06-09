import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Settings, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { T3Logo } from "@/components/t3-logo";

export function AppSidebar() {
  const chatHistory = [
    { category: "Today", items: ["Title for bg-sidebar"] },
    { category: "Other", items: ["Black Holes Reality"] },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
          <div
            data-sidebar="header"
            className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 !pt-safe"
          >
            <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
              <a
                className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
                href="/"
                data-discover="true"
              >
                <div className="h-3.5 select-none">
                  <T3Logo />
                </div>
              </a>
            </h1>
            <div className="px-1">
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
            <div className="border-b border-chat-border px-3">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-search -ml-[3px] mr-3 !size-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  role="searchbox"
                  aria-label="Search threads"
                  placeholder="Search your threads..."
                  className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4"></div>

          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your threads..."
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-4">
          {chatHistory.map((section, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {section.category}
              </h3>
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-2 rounded-md hover:bg-gray-700 cursor-pointer text-sm text-gray-300 mb-1"
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {/* User Profile */}
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
