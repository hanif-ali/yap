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
    experimental_throttle: 50,
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
          className="absolute inset-0 overflow-y-scroll sm:top-3.5 py-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
          style={{
            paddingBottom: "144px",
            scrollbarGutter: "stable both-edges",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.2) transparent"
          }}
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
          />
        </div>

        {/* Top Corner Decoration with Settings Buttons - positioned after scroll container to ensure proper z-index */}
        <div className="fixed right-0 top-0 max-sm:hidden z-40">
          <div
            className="group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy bg-gradient-noise-top"
            style={{
              boxShadow: "10px -10px 8px 2px hsl(var(--gradient-noise-top))",
            }}
          >
            <svg
              className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 128 32"
              xmlSpace="preserve"
            >
              <line
                stroke="hsl(var(--gradient-noise-top))"
                strokeWidth="2px"
                shapeRendering="optimizeQuality"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeMiterlimit="10"
                x1="1"
                y1="0"
                x2="128"
                y2="0"
              ></line>
              <path
                className="translate-y-[0.5px]"
                fill="hsl(var(--gradient-noise-top))"
                shapeRendering="optimizeQuality"
                strokeWidth="1px"
                strokeLinecap="round"
                strokeMiterlimit="10"
                vectorEffect="non-scaling-stroke"
                d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0"
                stroke="hsl(var(--chat-border))"
              ></path>
            </svg>
          </div>

          {/* Settings Buttons positioned over the corner */}
          <div
            className="fixed right-2 top-2 z-50 pointer-events-auto"
            style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}
          >
            <div className="flex flex-row items-center bg-gradient-noise-top text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 rounded-bl-xl"
                aria-label="Go to settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-settings2 size-4"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 group relative size-8"
                aria-label="Toggle theme"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon absolute size-4 transition-all duration-200 -rotate-90 scale-0"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun absolute size-4 transition-all duration-200 rotate-0 scale-100"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
                <span className="sr-only">Toggle theme</span>
              </button>
            </div>
          </div>
        </div>
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
                  append={append}
                  model={model}
                  setModel={setModel}
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
