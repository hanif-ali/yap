"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  PinOff,
  Search,
  X,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelDefinition, modelDefinitions } from "@/lib/models/models";
import { ListModelItem } from "./list-model-item";
import { GridModelItem } from "./grid-model-item";
import { useLocalStorage } from "usehooks-ts";
import { useUserConfig } from "@/hooks/use-user-config";

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
  const [searchQuery, setSearchQuery] = useState("");

  const [favorites, setFavorites] = useLocalStorage<
    Array<ModelDefinition["key"]>
  >("favorite-models", [
    "grok-3-mini",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
  ]);

  const { config } = useUserConfig();

  const handleModelSelect = useCallback(
    (model: string) => {
      onModelSelect(model);
      setOpen(false);
    },
    [onModelSelect]
  );

  const handleFavorite = useCallback(
    (model: string) => {
      setFavorites((prev) => [...prev, model]);
    },
    [setFavorites]
  );

  const handleUnfavorite = useCallback(
    (model: string) => {
      setFavorites((prev) => prev.filter((m) => m !== model));
    },
    [setFavorites]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Memoize filtered models to avoid recalculation on every render
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return modelDefinitions;
    return modelDefinitions.filter(
      (model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const { filteredFavorites, filteredOthers } = useMemo(() => {
    const favs = filteredModels.filter((model) =>
      favorites.includes(model.key)
    );
    const others = filteredModels.filter(
      (model) => !favorites.includes(model.key)
    );

    return {
      filteredFavorites: favs,
      filteredOthers: others,
    };
  }, [filteredModels, favorites]);

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
            "p-2 border-gray-800 text-white animate-in slide-in-from-bottom-2 duration-200",
            showAll ? "w-[580px]" : "w-[425px]"
          )}
          side="top"
          align="start"
          // sideOffset={8}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--chat-border)]">
            <Search className="mr-3 !size-4 text-muted-foreground" />
            <input
              role="searchbox"
              aria-label="Search models"
              placeholder={
                showAll
                  ? `Search ${filteredModels.length} available models...`
                  : `Search favorite models...`
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="ml-2 p-1 hover:bg-muted rounded-sm transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <ScrollArea className="h-[550px]">
            {showAll ? (
              <>
                <div className="px-3 pt-4">
                  <div className="flex w-full select-none items-center justify-start gap-1.5 text-[var(--heading)] mb-3">
                    <PinOff className="mt-px size-4" />
                    Favorites
                  </div>
                  <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4">
                    {filteredFavorites.map((model: ModelDefinition, index) => (
                      <GridModelItem
                        key={model.key}
                        model={model}
                        onClick={() => handleModelSelect(model.key)}
                        onFavorite={() => handleFavorite(model.key)}
                        onUnfavorite={() => handleUnfavorite(model.key)}
                        isFavorite={true}
                        isConfigured={Boolean(config?.openRouterKey)}
                      />
                    ))}
                  </div>
                </div>
                <div className="px-3">
                  <div className="flex w-full select-none items-center justify-start gap-1.5 text-[var(--heading)] mb-3">
                    Others
                  </div>
                  <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4">
                    {filteredOthers.map((model: ModelDefinition) => (
                      <GridModelItem
                        key={model.key}
                        model={model}
                        onClick={() => handleModelSelect(model.key)}
                        onFavorite={() => handleFavorite(model.key)}
                        onUnfavorite={() => handleUnfavorite(model.key)}
                        isFavorite={false}
                        isConfigured={Boolean(config?.openRouterKey)}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4">
                {filteredFavorites.map((model: ModelDefinition) => (
                  <ListModelItem
                    key={model.key}
                    model={model}
                    onClick={() => handleModelSelect(model.key)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between mt-4 pt-2 border-t border-[var(--chat-border)]">
            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground"
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
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
