"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown, Search, Paperclip, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatBox() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
      <div className="rounded-t-[20px] overflow-hidden border-reflect backdrop-blur-lg bg-chat-input-background">
        <div className="p-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none border-none outline-none text-lg min-h-[00px]"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <span className="text-sm font-medium">Gemini 2.5 Flash</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </button>

            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
