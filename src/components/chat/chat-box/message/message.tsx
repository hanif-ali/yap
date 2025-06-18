"use client";

import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { PencilEditIcon, SparklesIcon } from "@/components/icons";
import { Markdown } from "./markdown";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import { PreviewAttachment } from "../preview-attachment";
import { DocumentPreview } from "@/components/document-preview";
import { DocumentToolCall, DocumentToolResult } from "@/components/document";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { WebSearchCall } from "@/components/web-search/web-search-call";

const PurePreviewMessage = ({
  message,
  isLoading,
  requiresScrollPadding,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  requiresScrollPadding: boolean;
}) => {
  // todo add editing
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning") {
                // todo fix
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === "user" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Edit message</TooltipContent>
                        </Tooltip>
                      )}
                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4 text-sm", {
                          "bg-secondary/50 border-secondary/50 px-4 py-4 rounded-xl max-w-xs":
                            message.role === "user",
                        })}
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      {/* todo fix */}
                      {/* <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      /> */}
                    </div>
                  );
                }
              }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "call") {
                  const { args } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className={cn({
                        skeleton: ["getWeather"].includes(toolName),
                      })}
                    >
                      {toolName === "createDocument" ? (
                        <DocumentPreview args={args} />
                      ) : toolName === "updateDocument" ? (
                        <DocumentToolCall type="update" args={args} />
                      ) : toolName === "webSearch" ? (
                        <WebSearchCall state={state} result={[]} />
                      ) : null}
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;

                  if (toolName === "createDocument") {
                    return <DocumentPreview result={result} key={key} />;
                  }
                  if (toolName === "updateDocument") {
                    return (
                      <DocumentToolResult
                        type="update"
                        result={result}
                        key={key}
                      />
                    );
                  }
                  if (toolName === "webSearch") {
                    return (
                      <WebSearchCall key={key} state={state} result={result} />
                    );
                  }

                  return <pre key={key}>{JSON.stringify(result, null, 2)}</pre>;
                }
              }
            })}

            {/* todo fix */}
            {/* <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              isLoading={isLoading}
            /> */}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-end gap-1 text-muted-foreground mb-2 mt-auto">
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
