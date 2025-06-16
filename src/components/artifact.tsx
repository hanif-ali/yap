import type { Attachment, UIMessage } from "ai";
import { formatDistance } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";
import { MultimodalInput } from "./chat/chat-box/multimodal-input";
import { ArtifactCloseButton } from "./artifact-close-button";
import { ArtifactMessages } from "./artifact-messages";
import { useSidebar } from "./ui/sidebar";
import { useArtifact } from "@/hooks/use-artifact";
import { imageArtifact } from "@/artifacts/image/client";
import { codeArtifact } from "@/artifacts/code/client";
import { sheetArtifact } from "@/artifacts/sheet/client";
import { textArtifact } from "@/artifacts/text/client";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const artifactDefinitions = [
  textArtifact,
  codeArtifact,
  imageArtifact,
  sheetArtifact,
];
export type ArtifactKind = (typeof artifactDefinitions)[number]["kind"];

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

function PureArtifact({
  chatId,
  input,
  setInput,
  handleSubmit,
  status,
  stop,
  attachments,
  setAttachments,
  append,
  messages,
  setMessages,
  reload,
  model,
  setModel,
}: {
  chatId: string;
  input: string;
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: UseChatHelpers["stop"];
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  append: UseChatHelpers["append"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  reload: UseChatHelpers["reload"];
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
}) {
  const { artifact, metadata, setMetadata } = useArtifact();

  const document = useQuery(api.documents.getDocumentById, {
    id: artifact.documentId,
  });

  const updateDocument = useMutation(api.documents.updateDocument);

  const { open: isSidebarOpen } = useSidebar();

  const [isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    async (updatedContent: string) => {
      if (!artifact) return;
      await updateDocument({
        id: artifact.documentId,
        content: updatedContent,
        title: artifact.title,
        kind: artifact.kind,
      });
      setIsContentDirty(false);
    },
    [artifact, updateDocument]
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    500
  );

  const saveContent = useCallback(
    (updatedContent: string) => {
      if (document && updatedContent !== document.content) {
        setIsContentDirty(true);
        debouncedHandleContentChange(updatedContent);
      }
    },
    [document, debouncedHandleContentChange]
  );

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind
  );

  if (!artifactDefinition) {
    throw new Error("Artifact definition not found!");
  }

  useEffect(() => {
    if (artifact.documentId !== "init") {
      if (artifactDefinition.initialize) {
        artifactDefinition.initialize({
          documentId: artifact.documentId,
          setMetadata,
        });
      }
    }
  }, [artifact.documentId, artifactDefinition, setMetadata]);

  return (
    <AnimatePresence>
      {artifact.isVisible && (
        <motion.div
          data-testid="artifact"
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {!isMobile && (
            <motion.div
              className="fixed bg-background h-dvh"
              initial={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
            />
          )}

          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <div className="flex flex-col h-full justify-between items-center">
                <div
                  className="absolute inset-0 overflow-y-scroll sm:top-3.5 py-10"
                  style={{
                    paddingBottom: "144px",
                    scrollbarGutter: "stable both-edges",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.2) transparent",
                  }}
                >
                  <ArtifactMessages
                    chatId={chatId}
                    status={status}
                    messages={messages}
                    setMessages={setMessages}
                    reload={reload}
                    artifactStatus={artifact.status}
                  />
                </div>

                <div className="absolute w-full h-full pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none px-2">
                    <div className="mx-auto flex w-full max-w-3xl flex-col text-center">
                      <div className="pointer-events-none">
                        <div className="pointer-events-auto">
                          <MultimodalInput
                            chatId={chatId}
                            input={input}
                            setInput={setInput}
                            handleSubmit={handleSubmit}
                            status={status}
                            stop={stop}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            messages={messages}
                            append={append}
                            className="bg-background dark:bg-muted"
                            setMessages={setMessages}
                            model={model}
                            setModel={setModel}
                            searchEnabled={false}
                            setSearchEnabled={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-y-scroll md:border-l dark:border-zinc-700 border-zinc-200"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : "calc(100dvw)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : "calc(100dvw-400px)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <div className="p-2 flex flex-row justify-between items-start">
              <div className="flex flex-row gap-4 items-start">
                <ArtifactCloseButton />

                <div className="flex flex-col">
                  <div className="font-medium">{artifact.title}</div>

                  {isContentDirty ? (
                    <div className="text-sm text-muted-foreground">
                      Saving changes...
                    </div>
                  ) : document ? (
                    <div className="text-sm text-muted-foreground">
                      {`Updated ${formatDistance(
                        new Date(document.updatedAt),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}`}
                    </div>
                  ) : (
                    <div className="w-32 h-3 mt-2 bg-muted-foreground/20 rounded-md animate-pulse" />
                  )}
                </div>
              </div>

              {/* <ArtifactActions
                artifact={artifact}
                currentVersionIndex={currentVersionIndex}
                handleVersionChange={handleVersionChange}
                isCurrentVersion={isCurrentVersion}
                mode={mode}
                metadata={metadata}
                setMetadata={setMetadata}
              /> */}
            </div>

            <div className="dark:bg-muted bg-background h-full overflow-y-scroll !max-w-full items-center">
              <artifactDefinition.content
                title={artifact.title}
                content={
                  // isCurrentVersion
                  //   ? artifact.content
                  //   : getDocumentContentById(currentVersionIndex)
                  artifact.status === "streaming"
                    ? artifact.content
                    : document?.content || ""
                }
                status={artifact.status}
                mode="edit"
                currentVersionIndex={0}
                suggestions={[]}
                onSaveContent={saveContent}
                isInline={false}
                isCurrentVersion={true}
                getDocumentContentById={() => ""}
                isLoading={false}
                metadata={metadata}
                setMetadata={setMetadata}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  
  return true;
});
