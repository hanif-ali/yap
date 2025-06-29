import Link from "next/link";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

export function HistoricalChatButton({ chat }: { chat: Doc<"threads"> }) {
  return (
    <li>
      <Button
        className="bg-transparent overflow-hidden w-full outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:focus-visible:bg-sidebar-accent"
        asChild
      >
        <Link href={`/chat/${chat.id}`}>
          <div className="flex w-full items-center">
            <input
              value={chat.title ?? "Untitled"}
              className="border-none cursor-pointer overflow-hidden truncate outline-none bg-transparent w-full pointer-events-none"
              // fix this add event handling
              onChange={() => {}}
            />
          </div>
        </Link>
      </Button>
    </li>
  );
}
