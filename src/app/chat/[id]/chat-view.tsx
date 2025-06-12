"use client";

import { useChat } from "@ai-sdk/react";
// import { unstable_serialize } from "swr";
// import { getChatHistoryPaginationKey } from "../../../../ai-chatbot/lib/pagination";
// import { useSWRConfig } from "swr";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "../../../../ai-chatbot/components/multimodal-input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { generateUUID } from "@/lib/utils";

export default function ChatView({
  preloadedMessages,
  id,
}: {
  preloadedMessages: any;
  id: string;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages: preloadedMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    // fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      // selectedChatModel: initialChatModel,
      // selectedVisibilityType: visibilityType,
    }),
    onFinish: () => {
      console.log("finished");
      // mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      // TODO: Error handling
      // if (error instanceof ChatSDKError) {
      //   toast({
      //     type: 'error',
      //     description: error.message,
      //   });
      // }
    },
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* <ChatHeader
          chatId={id}
          selectedModelId="gpt-4o"
          selectedVisibilityType="public"
          isReadonly={false}
          session={null}
        /> */}

        <Messages
          chatId={id}
          status={status}
          votes={[]}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
          isArtifactVisible={true}
        />

        {/* {!isReadonly && ( */}
        <MultimodalInput
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={[]}
          setAttachments={() => {}}
          messages={messages}
          setMessages={setMessages}
          append={append}
          selectedVisibilityType="public"
        />
        {/* )} */}
      </div>
      {/* 
      <ArtifactsView
        // chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        // attachments={attachments}
        // setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        // votes={votes}
        // isReadonly={isReadonly}
        // selectedVisibilityType={visibilityType}
      /> */}
    </>
  );
}
