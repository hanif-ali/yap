import { FileIcon, LoaderIcon, MessageIcon, PencilEditIcon } from "../icons";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useState } from "react";

export const WebSearchCall = ({
  state,
  result,
}: {
  state: "call" | "result";
  result: Array<{
    title: string;
    url: string;
    content: string;
    publishedDate: string;
  }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (state === "result") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div 
            className="w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3 cursor-pointer hover:bg-accent/30 transition-colors"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex flex-row gap-3 items-start">
              <div className="text-zinc-500 mt-1">
                <FileIcon />
              </div>

              <div className="text-left">
                Found {result.length} results on the web
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-3 border-[var(--chat-border)] bg-[var(--sidebar-bg)]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="space-y-2">
            <h3 className="font-medium text-sm mb-3 text-[var(--heading)]">Search Results</h3>
            <div className="max-h-80 overflow-y-auto space-y-2 scrollbar-thin">
              {result.map((item, index) => (
              <div key={index} className="border-b last:border-b-0 pb-2 last:pb-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:bg-accent/30 p-2 rounded transition-colors text-color-heading"
                >
                  <div className="font-medium text-sm text-color-heading hover:text-white line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {item.url}
                  </div>
                  {item.publishedDate && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.publishedDate).toLocaleDateString()}
                    </div>
                  )}
                </a>
              </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3">
      <div className="flex flex-row gap-3 items-start">
        <div className="text-zinc-500 mt-1">
          <FileIcon />
        </div>

        <div className="text-left">Searching the web...</div>
      </div>

      <div className="animate-spin mt-1">{<LoaderIcon />}</div>
    </div>
  );
};
