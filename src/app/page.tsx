"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Settings,
  Sun,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/app-sidebar";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function FloatingButtons() {
  const { state } = useSidebar();

  const tasks = useQuery(api.tasks.get);
  console.log({tasks})

  return (
    <div
      className={cn(
        "fixed top-2 left-1 flex items-center gap-0.5 z-10 transition-all duration-300 ease-in-out rounded-md p-1",
        state === "collapsed" ? "bg-sidebar" : "bg-transparent"
      )}
    >
      <SidebarTrigger className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground" />
      <div
        className={cn(
          "flex items-center gap-0.5 transition-all duration-300 ease-in-out",
          state === "expanded"
            ? "opacity-0 -translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors duration-200 hover:text-muted-foreground"
        >
          <Sun className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const [message, setMessage] = useState("");

  const chatHistory = [
    { category: "Today", items: ["Title for bg-sidebar"] },
    { category: "Other", items: ["Black Holes Reality"] },
  ];

  return (
    <div className="flex h-screen text-white">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <FloatingButtons />
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-end">
                <div className="bg-gray-700 rounded-lg p-4 max-w-xs">
                  <p className="text-sm">Are black holes real?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-3xl">
                  <p className="text-gray-300 mb-4">
                    Yes, black holes are real. There is a lot of evidence that
                    supports their existence:
                  </p>

                  <ul className="space-y-4 text-gray-300">
                    <li>
                      <strong className="text-white">
                        Gravitational Effects:
                      </strong>{" "}
                      We observe stars and gas orbiting seemingly empty points
                      in space at incredibly high speeds, which can only be
                      explained by the presence of a massive, unseen object like
                      a black hole.
                    </li>

                    <li>
                      <strong className="text-white">X-ray Emissions:</strong>{" "}
                      As matter falls into a black hole, it forms an accretion
                      disk that heats up to millions of degrees, emitting
                      intense X-rays that we can detect with telescopes.
                    </li>

                    <li>
                      <strong className="text-white">
                        Gravitational Lensing:
                      </strong>{" "}
                      The immense gravity of black holes can bend and distort
                      the light from objects behind them, creating a "lensing"
                      effect that we can observe.
                    </li>

                    <li>
                      <strong className="text-white">Direct Imaging:</strong>{" "}
                      The Event Horizon Telescope has captured the first direct
                      images of the "shadow" of a black hole, providing visual
                      confirmation of their existence.
                    </li>
                  </ul>

                  <p className="text-gray-300 mt-4">
                    Furthermore, the theory of general relativity, which is one
                    of the most well-tested and successful theories in physics,
                    predicts the existence of black holes.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-gray-700 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>Gemini 2.0 Flash</span>
                  <Button variant="ghost" size="icon" className="h-4 w-4">
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
