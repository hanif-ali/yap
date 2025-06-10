"use client";

import { Message } from "@/components/chat/message";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function ChatMessages({
  preloadedMessages,
}: {
  preloadedMessages: Preloaded<typeof api.messages.getForThread>;
}) {
  const messages = usePreloadedQuery(preloadedMessages);
	console.log({messages})

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
}
