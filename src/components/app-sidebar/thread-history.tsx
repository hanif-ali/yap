import { usePreloadedQuery, Preloaded } from "convex/react";
import { ScrollArea } from "../ui/scroll-area";
import { api } from "../../../convex/_generated/api";
import { categorizeThreads } from "./utils";
import { HistoricalChatButton } from "./historical-chat-button";
import { Search } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";

interface ThreadHistoryProps {
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
  searchQuery: string;
}

export function ThreadHistory({
  preloadedThreads,
  searchQuery,
}: ThreadHistoryProps) {
  const chats = usePreloadedQuery(preloadedThreads);

  // Filter chats based on search query
  const filteredChats = chats?.filter((chat) => {
    if (!searchQuery.trim()) return true;
    return chat.title.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const categorizedChats = categorizeThreads(filteredChats);

  return (
    <div>
      {categorizedChats &&
        Object.entries(categorizedChats).map(([category, chats]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="text-sm font-medium text-[var(--heading)] mb-2">
              {category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="flex flex-col gap-1">
                {chats.map((chat) => (
                  <HistoricalChatButton chat={chat} key={chat._id} />
                ))}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
    </div>
  );
}
