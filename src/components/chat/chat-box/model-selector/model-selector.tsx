"use client";

import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
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
import { ModelDefinition, models } from "@/lib/models/models";
import { providerLogos } from "@/lib/models/provider-logos";
import { ListModelItem } from "./list-model-item";
import { GridModelItem } from "./grid-model-item";

interface ModelSelectorProps {
  onModelSelect: (model: ModelDefinition["key"]) => void;
  selectedModel: ModelDefinition["key"];
}

export function ModelSelector({
  onModelSelect,
  selectedModel,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);

  const handleModelSelect = (model: string) => {
    onModelSelect(model);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="justify-between">
            {selectedModel}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-2 bg-sidebar border-gray-800 text-white animate-in slide-in-from-bottom-2 duration-200",
            showAll ? "w-[550px]" : "w-[425px]"
          )}
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
            {showAll ? (
              <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4 pl-3 pr-2 pt-2.5">
                {models.map((model) => (
                  <GridModelItem
                    key={model.key}
                    name={model.name}
                    icon={
                      providerLogos[
                        model.provider as keyof typeof providerLogos
                      ]
                    }
                    capabilities={model.capabilities}
                    onClick={() => handleModelSelect(model.key)}
                    allowed={model.allowed}
                  />
                ))}
              </div>
            ) : (
              <div className="py-4">
                {models.map((model) => (
                  <ListModelItem
                    key={model.key}
                    name={model.name}
                    icon={
                      providerLogos[
                        model.provider as keyof typeof providerLogos
                      ]
                    }
                    capabilities={model.capabilities}
                    onClick={() => handleModelSelect(model.key)}
                    allowed={model.allowed}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between p-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="text-white gap-2"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  Favorites
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show all
                </>
              )}
              <Badge
                variant="outline"
                className="rounded-full h-2 w-2 p-0 bg-pink-500 border-0"
              />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
