import type { CoreAssistantMessage, CoreToolMessage } from "ai";
import { Attachment } from "ai";
import { UIMessage } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function convertToUIMessages(
  messages: Array<Doc<"messages">>
): Array<UIMessage> {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage["parts"],
    role: message.role as UIMessage["role"],
    // Note: content will soon be deprecated in @ai-sdk/react
    content: "",
    createdAt: new Date(message.createdAt),
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }));
}
export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  try {
    const response = await fetch(input, init);

    if (response.status === 429) {
      toast.error(
        "You have reached the maximum number of messages you can send. Please try again later."
      );
      return;
    }

    if (!response.ok) {
      const { code, cause } = await response.json();
      toast.error(cause);
      console.error({ code, cause });
      return;
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error("You are offline");
      // throw new ChatSDKError('offline:chat');
    }
    toast.error("Something went wrong");

    throw error;
  }
}
