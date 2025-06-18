import { api } from "../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import ChatView from "./chat-view";
import { convertToUIMessages } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const threadId = (await params).id;

  const messages = await fetchQuery(api.messages.getMessagesForThread, {
    threadId,
  });

  const uiMessages = convertToUIMessages(messages);

  return (
    <>
      <ChatView
        preloadedMessages={uiMessages}
        id={threadId}
        autoResume={true}
      />
      <DataStreamHandler id={threadId} />
    </>
  );
}
