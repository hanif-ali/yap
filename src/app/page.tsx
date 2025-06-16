import ChatView from "./chat/[id]/chat-view";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { TopBar } from "@/components/top-bar";

export default function Home() {
  const id = generateUUID();

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      <TopBar />
      <ChatView preloadedMessages={[]} id={id} />
      <DataStreamHandler id={id} />
    </main>
  );
}
