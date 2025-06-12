import { useQuery } from "convex/react";
import { ScrollArea } from "../ui/scroll-area";
import { api } from "../../../convex/_generated/api";
import { categorizeThreads } from "./utils";
import { HistoricalChatButton } from "./historical-chat-button";

export function ThreadHistory() {
  const chats = useQuery(api.threads.getForCurrentUser);

  const categorizedChats = categorizeThreads(chats || []);

  return (
    <>
      <div className="border-b border-chat-border mb-4">
        <div className="flex items-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        {categorizedChats &&
          Object.entries(categorizedChats).map(([category, chats]) => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-medium text-[var(--heading)] mb-2">
                {category}
              </h3>
              {chats.map((chat) => (
								<HistoricalChatButton chat={chat} key={chat._id} />
              ))}
            </div>
          ))}
      </ScrollArea>
    </>
  );
}
