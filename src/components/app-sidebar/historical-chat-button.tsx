import Link from "next/link";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

export function HistoricalChatButton({ chat }: { chat: Doc<"threads"> }) {
  // todo fix overflow
  return (
    <Button
      variant="ghost"
      className="w-full overflow-x-hidden transition-colors duration-200 text-muted-foreground text-start justify-start"
      asChild
    >
      <Link href={`/chat/${chat.id}`} className="overflow-x-hidden">{chat.title || "Untitled Chat"}</Link>
    </Button>
  );
}
