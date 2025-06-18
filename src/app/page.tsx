import ChatView from "./(chat)/chat/[id]/chat-view";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default function Home() {
  const id = generateUUID();

  return (
    <>
      <ChatView preloadedMessages={[]} id={id} />
      <DataStreamHandler id={id} />
    </>
  );
}
