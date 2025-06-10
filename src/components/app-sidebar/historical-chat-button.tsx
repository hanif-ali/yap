import Link from "next/link";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

export function HistoricalChatButton({ chat }: { chat: Doc<"threads"> }) {
  return (
    <Button
      variant="ghost"
      className="w-full transition-colors duration-200 text-muted-foreground text-start justify-start"
      asChild
    >
      <Link href={`/chat/${chat._id}`}>{chat.title || "Untitled Chat"}</Link>
    </Button>
  );
}
