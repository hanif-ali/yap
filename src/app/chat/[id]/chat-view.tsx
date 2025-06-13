"use client";

import { useChat } from "@ai-sdk/react";
// import { unstable_serialize } from "swr";
// import { getChatHistoryPaginationKey } from "../../../../ai-chatbot/lib/pagination";
// import { useSWRConfig } from "swr";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "@/components/chat/chat-box/multimodal-input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { generateUUID } from "@/lib/utils";
import { useState } from "react";
import { ModelDefinition } from "@/lib/models/models";
import { useAutoResume } from "../../../../ai-chatbot/hooks/use-auto-resume";

export default function ChatView({
  preloadedMessages,
  id,
  autoResume = false,
}: {
  preloadedMessages: any;
  id: string;
  autoResume?: boolean;
}) {
  const [model, setModel] =
    useState<ModelDefinition["key"]>("gemini-2.0-flash-lite");

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
      selectedChatModel: model,
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

  useAutoResume({
    autoResume,
    initialMessages: preloadedMessages,
    experimental_resume,
    data,
    setMessages,
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
          model={model}
          setModel={setModel}
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
