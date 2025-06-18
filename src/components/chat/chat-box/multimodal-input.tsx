"use client";

import type { Attachment, UIMessage } from "ai";
import type React from "react";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "@/components/icons";
import { PreviewAttachment } from "./preview-attachment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ModelSelector } from "./model-selector/model-selector";
import { ModelDefinition } from "@/lib/models/models";
import { WebSearchButton } from "./web-search-button";
import { TokensWarning } from "./tokens-warning";

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  handleSubmit,
  // className,
  model,
  setModel,
  searchEnabled,
  setSearchEnabled,
}: {
  chatId: string;
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  model: ModelDefinition["key"];
  setModel: Dispatch<SetStateAction<ModelDefinition["key"]>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  className?: string;

  searchEnabled: boolean;
  setSearchEnabled: (value: boolean) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  // todo fix height weirdnesses
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "74px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
    }
  }, [textareaRef, localStorageInput, setInput]);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    window.history.replaceState({}, "", `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setInput("");
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setInput,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("threadId", chatId);

      try {
        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const { url, pathname, contentType } = data;

          return {
            id: data.attachmentId,
            url,
            name: pathname,
            contentType: contentType,
          };
        }
        const { error } = await response.json();
        toast.error(error);
      } catch (error) {
        toast.error("Failed to upload file, please try again!");
        console.error(error);
      }
    },
    [chatId]
  );

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments, uploadFile]
  );

  const { isAtBottom, scrollToBottom } = useScrollToBottom();

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center ">
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="z-50 mx-auto mb-4"
          >
            <Button
              data-testid="scroll-to-bottom-button"
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                scrollToBottom();
              }}
            >
              <ArrowDown />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length !== 0 && <TokensWarning chatId={chatId} />}

      <div
        className="mt-2 border-reflect rounded-t-[20px] bg-[var(--chat-input-background)] p-2 pb-0 backdrop-blur-lg"
        style={{
          // @ts-expect-error CSS variables cause TS errors for some reason idkr
          "--start": "#000000e0",
          "--opacity": "0.2",
        }}
      >
        <div
          className="pb-3 relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 bg-[var(--chat-input-background)] px-3 pt-2 text-secondary-foreground border-[hsl(0,0%,83%)]/[0.04]"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px",
            // @ts-expect-error CSS variables cause TS errors for some reason idk
            "--opacity": "1",
          }}
        >
          <input
            type="file"
            className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            tabIndex={-1}
          />

          <div className="flex flex-grow flex-col">
            {(attachments.length > 0 || uploadQueue.length > 0) && (
              <div
                data-testid="attachments-preview"
                className="flex flex-row gap-2 overflow-x-scroll items-end mb-2"
              >
                {attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}

                {uploadQueue.map((filename) => (
                  <PreviewAttachment
                    key={filename}
                    attachment={{
                      url: "",
                      name: filename,
                      contentType: "",
                    }}
                    isUploading={true}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-grow flex-row items-start">
              <Textarea
                data-testid="multimodal-input"
                ref={textareaRef}
                value={input}
                placeholder="Type your message here..."
                onChange={handleInput}
                rows={2}
                className="w-full resize-none bg-transparent text-base leading-6 text-foreground outline-none border-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
                style={{ height: "48px !important" }}
                autoFocus
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();

                    if (status !== "ready") {
                      toast.error(
                        "Please wait for the model to finish its response!"
                      );
                    } else {
                      submitForm();
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
            <div
              className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2"
              aria-label="Message actions"
            >
              {status === "submitted" ? (
                <StopButton stop={stop} setMessages={setMessages} />
              ) : (
                <SendButton
                  input={input}
                  submitForm={submitForm}
                  uploadQueue={uploadQueue}
                />
              )}
            </div>
            <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
              <div className="ml-[-7px] flex items-center gap-1">
                <ModelSelector onModelSelect={setModel} selectedModel={model} />
                <WebSearchButton
                  selectedModel={model}
                  searchEnabled={searchEnabled}
                  setSearchEnabled={setSearchEnabled}
                />
                <AttachmentsButton
                  fileInputRef={fileInputRef}
                  status={status}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;
    if (prevProps.model !== nextProps.model) return false;
    if (prevProps.searchEnabled !== nextProps.searchEnabled) return false;
    if (prevProps.setSearchEnabled !== nextProps.setSearchEnabled) return false;

    return true;
  }
);

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  status: UseChatHelpers["status"];
}) {
  return (
    <Button
      data-testid="attachments-button"
      className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-muted-foreground max-sm:p-2"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={status !== "ready"}
      variant="ghost"
    >
      <PaperclipIcon size={16} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers["setMessages"];
}) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      data-testid="send-button"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect font-semibold shadow bg-primary/20 hover:bg-main-button-hover/70 h-9 w-9 relative rounded-lg p-2"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={20} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
