import { DataStreamDelta } from "@/components/data-stream-handler";
import { useChat } from "@ai-sdk/react";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { X } from "lucide-react";
import { memo, useEffect, useState } from "react";

export const TokensWarning = memo(({ chatId }: { chatId: string }) => {
  const { data: dataStream } = useChat({ id: chatId });

  const [remainingTokens, setRemainingTokens] = useState<number | null>(null);

  useEffect(() => {
    const latestDataStreamElement = dataStream?.[dataStream.length - 1] as
      | DataStreamDelta
      | undefined;

    if (!(latestDataStreamElement?.type === "remaining-tokens")) {
      return;
    }

    setRemainingTokens(parseInt(latestDataStreamElement.content));
  }, [dataStream]);


  const isOutOfMessages = remainingTokens === 0;

  return (
    <>
      {remainingTokens !== null && (
        <div className="pointer-events-auto mx-auto w-fit">
          <div
            className={`relative mx-auto my-4 rounded-xl border px-5 py-3 shadow-lg backdrop-blur-md blur-fallback:bg-secondary ${
              isOutOfMessages
                ? "border-red-400/20 bg-red-300/50 text-red-900 dark:border-red-800/20 dark:bg-red-800/30 dark:text-red-100/90"
                : "border-yellow-400/20 bg-yellow-300/50 text-yellow-800 dark:border-yellow-800/20 dark:bg-yellow-800/30 dark:text-yellow-100/90"
            }`}
          >
            <div className="pr-4">
              {isOutOfMessages
                ? "You have run out of messages"
                : `You only have ${remainingTokens} messages left. `}
              <SignedOut>
                <SignInButton>
                  <button
                    className={`h-auto ml-2 p-0 pb-0.5 underline ${
                      isOutOfMessages
                        ? "text-red-700 hover:text-red-950 dark:text-red-300/80 dark:hover:text-red-100"
                        : "text-yellow-600 hover:text-yellow-950 dark:text-yellow-300/80 dark:hover:text-yellow-100"
                    }`}
                  >
                    Sign in to reset your limits
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                isOutOfMessages
                  ? "text-red-900 hover:text-red-950 dark:text-red-100/90 dark:hover:text-red-100"
                  : "text-yellow-800 hover:text-yellow-950 dark:text-yellow-100/90 dark:hover:text-yellow-100"
              }`}
              onClick={() => {
                setRemainingTokens(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
});
