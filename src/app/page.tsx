
import ChatView from "./chat/[id]/chat-view";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default function Home() {
  const id = generateUUID();

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatView preloadedMessages={[]} id={id} />
        <DataStreamHandler id={id} />
      </div>
    </main>
  );
}
