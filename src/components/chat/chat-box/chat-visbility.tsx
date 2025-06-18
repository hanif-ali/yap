"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Lock, Unlock } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useUserConfig } from "@/providers/user-config-provider";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const ChatVisibility = ({ threadId }: { threadId: string }) => {
  const [open, setOpen] = useState(false);
  const { userConfig } = useUserConfig();
  const thread = useQuery(api.threads.getThreadById, { id: threadId });

  const setThreadVisibility = useMutation(api.threads.setThreadVisibility);

  const handleCopyLink = useCallback(async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
      console.error({ error });
    }
  }, []);

  const handleSetThreadVisibility = useCallback(
    async (value: boolean) => {
      try {
        await setThreadVisibility({
          id: threadId as any,
          public: value,
        });
        toast.success(`Chat is now ${value ? "public" : "private"}`);
      } catch (error) {
        toast.error("Failed to set chat visibility");
        console.error({ error });
      }
    },
    [threadId, setThreadVisibility]
  );

  if (!thread) return null;

  return (
    <div className="absolute top-7 left-4 right-0 bottom-0 z-10 h-10 w-fit rounded-md flex hover:bg-[hsl(var(--gradient-noise-top))] transition-all ease-snappy">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="">
            <ExternalLink />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-2 border-gray-800 text-white animate-in slide-in-from-bottom-2 duration-200 w-fit max-w-[450px] min-w-[300px]"
          )}
          side="top"
          align="start"
        >
          <div className="px-3 py-2 border-b border-[var(--chat-border)] font-semibold">
            Share Chat
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            {thread.public ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-3 py-2 text-sm text-foreground"
                  onClick={handleCopyLink}
                >
                  <Copy className="size-4" />
                  Copy link
                </Button>
                {userConfig.isAnonymous ? (
                  <p className="font-sm italic px-2 text-muted-foreground">
                    Chats created while logged out are always shareable. Sign in
                    to create private chats.
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300"
                    onClick={() => handleSetThreadVisibility(false)}
                  >
                    <Lock className="size-4" />
                    Make private
                  </Button>
                )}
              </>
            ) : (
              <>
                <>
                  <p className="font-sm italic px-2 text-muted-foreground">
                    This thread is private. To share it, make it public.
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-3 py-2 text-sm text-green-400 hover:text-green-300"
                    onClick={() => handleSetThreadVisibility(true)}
                  >
                    <Unlock className="size-4" />
                    Make public
                  </Button>
                </>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
