"use client";

import { useState } from "react";
import { Search, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FloatingButtons } from "@/components/floating-buttons";
import ChatView from "./chat/[id]/chat-view";
import { generateUUID } from "@/lib/utils";

export default function Home() {
  const [message, setMessage] = useState("");

  const id = generateUUID();

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatView preloadedMessages={[]} id={id} />
      </div>
    </main>
  );
}
