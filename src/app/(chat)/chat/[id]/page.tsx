import { api } from "../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import ChatView from "./chat-view";
import { convertToUIMessages } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { getAuthToken } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const threadId = (await params).id;
  const token = await getAuthToken();

  try {
    const messages = await fetchQuery(
      api.messages.getMessagesForThread,
      {
        threadId,
      },
      { token }
    );
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
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
