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

export function ThreadHistory({
  preloadedThreads,
}: {
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
}) {
  const chats = usePreloadedQuery(preloadedThreads);

  const categorizedChats = categorizeThreads(chats || []);

  return (
    <div>
      {categorizedChats &&
        Object.entries(categorizedChats).map(([category, chats]) => (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-[var(--heading)] mb-2">
              {category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {chats.map((chat) => (
                <HistoricalChatButton chat={chat} key={chat._id} />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
    </div>
  );
}
