import { api } from "../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import ChatView from "./chat-view";
import { convertToUIMessages } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default async function ChatPage({ params }: { params: { id: string } }) {
  // const { getToken } = await auth();
  // const token = await getToken();

  const messages = await fetchQuery(
    api.messages.getMessagesForThread,
    {
      threadId: params.id,
    }
    // { token: token ?? undefined }
  );

  const uiMessages = convertToUIMessages(messages);

  return (
    <main className="flex-1 flex flex-col">
      <ChatView
        preloadedMessages={uiMessages}
        id={params.id}
        autoResume={true}
      />
      <DataStreamHandler id={params.id} />
    </main>
  );
}
