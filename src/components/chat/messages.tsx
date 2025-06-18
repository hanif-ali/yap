import type { UIMessage } from "ai";
import { PreviewMessage, ThinkingMessage } from "./chat-box/message/message";
import { Greeting } from "./greeting";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  endRef: React.RefObject<HTMLDivElement | null>;
  onViewportEnter: () => void;
  onViewportLeave: () => void;
  hasSentMessage: boolean;
  append: UseChatHelpers["append"];
}

function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  reload,
  isReadonly,
  endRef: messagesEndRef,
  onViewportEnter,
  onViewportLeave,
  hasSentMessage,
  append,
}: MessagesProps) {
  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 relative">
      {messages.length === 0 && <Greeting append={append} />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          setMessages={setMessages}
          reload={reload}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, () => {
  // todo fix memoization here
  // if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  // if (prevProps.status !== nextProps.status) return false;
  // if (prevProps.status && nextProps.status) return false;
  // if (prevProps.messages.length !== nextProps.messages.length) return false;
  // if (!equal(prevProps.messages, nextProps.messages)) return false;

  // return true;
  return false;
});
