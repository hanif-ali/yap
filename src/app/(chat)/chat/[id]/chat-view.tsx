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
import { useMessages } from "@/hooks/use-messages";
import { Cutout } from "@/components/cutout";
import { SettingsCutout } from "@/components/settings-cutout";

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
  const [searchEnabled, setSearchEnabled] = useState(false);

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
    experimental_throttle: 50,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    // fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedChatModel: model,
      searchEnabled,
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

  // Get the scroll container ref from useMessages hook
  const {
    containerRef: scrollContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId: id,
    status,
  });

  return (
    <>
      {/* Main Content Container */}
      <div className="absolute bottom-0 top-0 w-full">
        {/* Messages Scroll Container - ensure it doesn't interfere with page-level top bar */}
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-scroll sm:top-3.5 py-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 messages-scroll-gutter"
        >
          {/* Messages Container */}
          <Messages
            chatId={id}
            status={status}
            messages={messages}
            setMessages={setMessages}
            reload={reload}
            isArtifactVisible={true}
            isReadonly={false}
            endRef={messagesEndRef}
            onViewportEnter={onViewportEnter}
            onViewportLeave={onViewportLeave}
            hasSentMessage={hasSentMessage}
            append={append}
          />
          <SettingsCutout />
        </div>

        <Cutout />
      </div>
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none px-2">
          <div className="mx-auto flex w-full max-w-3xl flex-col text-center">
            <div className="pointer-events-none">
              <div className="pointer-events-auto">
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
                  model={model}
                  setModel={setModel}
                  searchEnabled={searchEnabled}
                  setSearchEnabled={setSearchEnabled}
                />
              </div>
            </div>
          </div>
        </div>
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
