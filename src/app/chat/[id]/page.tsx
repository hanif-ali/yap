import { Search, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "../../../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { ChatMessages } from "./chat-messages";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const preloadedMessages = (await preloadQuery(api.messages.getForThread, {
    threadId: params.id,
  }))!;
	console.log({id: params.id})

  return (
    <main className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <ChatMessages preloadedMessages={preloadedMessages} />
        </div>
      </ScrollArea>

      <div className="border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
            <Input
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>Gemini 2.0 Flash</span>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
