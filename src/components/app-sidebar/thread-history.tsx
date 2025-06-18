"use client";

import { api } from "../../../convex/_generated/api";
import { categorizeThreads } from "./utils";
import { HistoricalChatButton } from "./historical-chat-button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useQueryWithLocalStorageCache } from "@/hooks/use-query-with-local-storage-cache";
import { memo, useMemo } from "react";
import { Doc } from "../../../convex/_generated/dataModel";

interface ThreadHistoryProps {
  searchQuery: string;
}

export const ThreadHistory = memo(({ searchQuery }: ThreadHistoryProps) => {
  const chats = useQueryWithLocalStorageCache<Doc<"threads">[]>(
    "chats",
    api.threads.getForCurrentUser
  );

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!chats) return [];
    return chats.filter((chat) => {
      if (!searchQuery.trim()) return true;
      return chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, searchQuery]);

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
});

ThreadHistory.displayName = "ThreadHistory";

export default ThreadHistory;