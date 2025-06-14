"use client";

import { useChat } from "@ai-sdk/react";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "@/components/chat/chat-box/multimodal-input";
import { generateUUID } from "@/lib/utils";
import { useState } from "react";
import { ModelDefinition } from "@/lib/models/models";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { Attachment } from "ai";
import { Artifact } from "@/components/artifact";

export default function ChatView({
  preloadedMessages,
  id,
  autoResume = false,
}: {
  preloadedMessages: any;
  id: string;
  autoResume?: boolean;
}) {
  const [model, setModel] = useState<ModelDefinition["key"]>(
    "gemini-2.0-flash-lite"
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

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
    }),
    onError: () => {
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
        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isArtifactVisible={true}
        />

        <MultimodalInput
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
          model={model}
          setModel={setModel}
        />
        {/* )} */}
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        model={model}
        setModel={setModel}
      />
    </>
  );
}
