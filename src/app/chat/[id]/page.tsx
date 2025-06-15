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
    <main className="flex-1 flex flex-col z-1 relative">
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl">
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>
      <ChatView
        preloadedMessages={uiMessages}
        id={params.id}
        autoResume={true}
      />
      <DataStreamHandler id={params.id} />
    </main>
  );
}
