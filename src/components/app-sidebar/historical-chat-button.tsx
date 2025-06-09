import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

export function HistoricalChatButton({ chat }: { chat: Doc<"threads"> }) {
  return (
    <Button
      variant="ghost"
      className="w-full transition-colors duration-200 text-muted-foreground text-start justify-start"
    >
      {chat.title || "Untitled Chat"}
    </Button>
  );
}
