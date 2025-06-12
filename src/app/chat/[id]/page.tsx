import { api } from "../../../../convex/_generated/api";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import ChatView from "./chat-view";
import { auth } from "@clerk/nextjs/server";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { getToken } = await auth();
  const token = await getToken();

  const messages = await fetchQuery(
    api.messages.getMessagesForThread,
    {
      threadId: params.id,
    },
    // { token: token ?? undefined }
  );

  return (
    <main className="flex-1 flex flex-col">
      <ChatView preloadedMessages={messages} id={params.id} />
    </main>
  );
}
