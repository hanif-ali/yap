"use client";

import {
  ChevronDown,
  Eye,
  Globe,
  FileText,
  Brain,
  ImageIcon,
  Info,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ModelSelectorProps {
  onModelSelect?: (model: string) => void;
}

export function ModelSelector({ onModelSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gemini 2.0 Flash Lite");
  const [showAll, setShowAll] = useState(true);

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    if (onModelSelect) onModelSelect(model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-[240px] justify-between">
          {selectedModel}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[425px] p-2 bg-sidebar border-gray-800 text-white animate-in slide-in-from-bottom-2 duration-200"
        side="top"
        align="start"
        sideOffset={8}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b border-chat-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search -ml-[3px] mr-3 !size-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            role="searchbox"
            aria-label="Search threads"
            placeholder="Search your threads..."
            className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
          />
        </div>

        <div className="p-4 border-reflect mx-4 my-2 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Unlock all models + higher limits
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-pink-500">
              $8{" "}
              <span className="text-base font-normal text-gray-400">
                /month
              </span>
            </div>
            <Button className="bg-[#3a1a2a] hover:bg-[#4a2a3a] text-white border-0">
              Upgrade now
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4 py-4">
            <ModelItem
              name="Gemini 2.5 Flash"
              icon={<span className="text-pink-500">★</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              capabilities={["vision", "web", "text"]}
              featured
              onClick={() => handleModelSelect("Gemini 2.5 Flash")}
            />

            <ModelItem
              name="Gemini 2.5 Pro"
              icon={<span className="text-pink-500">★</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              capabilities={["vision", "web", "text", "reasoning"]}
              onClick={() => handleModelSelect("Gemini 2.5 Pro")}
            />

            <ModelItem
              name="GPT ImageGen"
              icon={<span className="text-orange-500">◎</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              isPremium
              capabilities={["vision", "image"]}
              onClick={() => handleModelSelect("GPT ImageGen")}
            />

            <ModelItem
              name="o4-mini"
              icon={<span className="text-orange-500">◎</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              capabilities={["vision", "reasoning"]}
              onClick={() => handleModelSelect("o4-mini")}
            />

            <ModelItem
              name="Claude 3.7 Sonnet"
              icon={<span className="text-purple-500">▲</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              isPremium
              capabilities={["vision", "text"]}
              onClick={() => handleModelSelect("Claude 3.7 Sonnet")}
            />

            <ModelItem
              name="Claude 4 Sonnet"
              icon={<span className="text-purple-500">▲</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              isPremium
              capabilities={["vision", "text"]}
              onClick={() => handleModelSelect("Claude 4 Sonnet")}
            />

            <ModelItem
              name="Claude 4 Sonnet (Reasoning)"
              icon={<span className="text-purple-500">▲</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              isPremium
              capabilities={["vision", "text", "reasoning"]}
              onClick={() => handleModelSelect("Claude 4 Sonnet (Reasoning)")}
            />

            <ModelItem
              name="Llama 4 Maverick"
              icon={<span className="text-red-500">∞</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              capabilities={["vision"]}
              onClick={() => handleModelSelect("Llama 4 Maverick")}
            />

            <ModelItem
              name="DeepSeek v3 (Fireworks)"
              icon={<span className="text-red-300">◆</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              onClick={() => handleModelSelect("DeepSeek v3 (Fireworks)")}
            />

            <ModelItem
              name="DeepSeek v3 (0324)"
              icon={<span className="text-red-300">◆</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              onClick={() => handleModelSelect("DeepSeek v3 (0324)")}
            />

            <ModelItem
              name="DeepSeek R1 (Llama Distilled)"
              icon={<span className="text-red-300">◆</span>}
              infoIcon={<Info className="h-4 w-4 text-gray-500" />}
              capabilities={["reasoning"]}
              onClick={() => handleModelSelect("DeepSeek R1 (Llama Distilled)")}
            />
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="text-white gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Show all
            <Badge
              variant="outline"
              className="rounded-full h-2 w-2 p-0 bg-pink-500 border-0"
            />
          </Button>
          <Button variant="ghost" className="text-white">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ModelItemProps {
  name: string;
  icon: React.ReactNode;
  infoIcon?: React.ReactNode;
  isPremium?: boolean;
  featured?: boolean;
  capabilities?: Array<"vision" | "web" | "text" | "reasoning" | "image">;
  onClick?: () => void;
}

function ModelItem({
  name,
  icon,
  infoIcon,
  isPremium,
  featured,
  capabilities = [],
  onClick,
}: ModelItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 cursor-pointer hover:bg-[#1a1a1a] rounded-md px-2",
        featured && "bg-[#1a1a1a]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className={cn("text-gray-300", featured && "text-white")}>
          {name}
        </span>
        {isPremium && <span className="text-yellow-500 text-xs">♦</span>}
        {infoIcon && <span>{infoIcon}</span>}
      </div>
      <div className="flex items-center gap-2">
        {capabilities.includes("vision") && (
          <div className="bg-gray-700 rounded-full p-1">
            <Eye className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("web") && (
          <div className="bg-gray-700 rounded-full p-1">
            <Globe className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("text") && (
          <div className="bg-gray-700 rounded-full p-1">
            <FileText className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("reasoning") && (
          <div className="bg-gray-700 rounded-full p-1">
            <Brain className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("image") && (
          <div className="bg-gray-700 rounded-full p-1">
            <ImageIcon className="h-4 w-4 text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}
