import { Search, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "../../../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { ChatMessages } from "./chat-messages";
import ChatBox from "./chat-box";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const preloadedMessages = (await preloadQuery(api.messages.getForThread, {
    threadId: params.id,
  }))!;
  console.log({ id: params.id });

  return (
    <main className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col">
          <ChatMessages preloadedMessages={preloadedMessages} />
        </div>
      </ScrollArea>
      <ChatBox />
    </main>
  );
}
