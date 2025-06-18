import { ModelDefinition } from "@/lib/models/models";
import {
  ImageCapabilityIcon,
  ReasoningCapabilityIcon,
  TextCapabilityIcon,
} from "./capabilities-icons";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { providerLogos } from "@/lib/models/provider-logos";
import { memo } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ModelItemProps {
  model: ModelDefinition;
  onClick?: () => void;
  onFavorite: () => void;
  onUnfavorite: () => void;
  isFavorite: boolean;
  isConfigured: boolean;
}

export const GridModelItem = memo(function GridModelItem({
  model,
  onClick,
  onFavorite,
  onUnfavorite,
  isFavorite,
  isConfigured,
}: ModelItemProps) {
  const renderCapabilities = () => (
    <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
      {model.inputCapabilities.includes("image") && <ImageCapabilityIcon />}
      {model.inputCapabilities.includes("text") && <TextCapabilityIcon />}
      {model.reasoning && <ReasoningCapabilityIcon />}
    </div>
  );

  const handleFavoriteToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isFavorite) {
      onUnfavorite();
    } else {
      onFavorite();
    }
  };

  const enabled = model.enabled && (isConfigured || !model.byok);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn("group relative", {
            "cursor-pointer": enabled,
            "opacity-50 cursor-not-allowed": !enabled,
          })}
          data-state="closed"
          onClick={enabled ? onClick : undefined}
        >
          <div className="absolute -left-1.5 -top-1.5 z-10 rounded-full bg-popover p-0.5" />
          <div className="absolute left-2 top-2 z-20 flex items-center">
            <div
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                model.byok
                  ? "bg-orange-100 text-orange-800 bg-orange-900/30 text-orange-300"
                  : "bg-green-100 text-green-800 bg-green-900/30 text-green-300"
              )}
            >
              {model.byok ? "OpenRouter" : "Free"}
            </div>
          </div>
          <button
            className={`pt-8 group relative flex h-[10rem] w-[7.4rem] flex-col items-center justify-between overflow-hidden rounded-xl border border-[var(--chat-border)]/50 bg-sidebar/20 px-2 py-4 text-color-heading [--model-muted:hsl(var(--muted-foreground)/0.9)] [--model-primary:hsl(var(--color-heading))] hover:bg-accent/30 hover:text-color-heading border-[var(--chat-border)] bg-[hsl(320,20%,2.9%)] [--model-muted:hsl(var(--color-heading))] [--model-primary:hsl(var(--muted-foreground)/0.9)] hover:bg-accent/30 ${!enabled ? "pointer-events-none" : ""}`}
          >
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center">
                {providerLogos[model.provider as keyof typeof providerLogos] ??
                  providerLogos["default"]}
              </div>
              <div className="w-full text-center text-[--model-primary] px-1">
                <div className="text-sm font-medium leading-tight line-clamp-2 break-words hyphens-auto">
                  {model.name}
                </div>
              </div>
            </div>
            {renderCapabilities()}
          </button>
          <div className="absolute -right-1.5 -top-1.5 left-auto z-50 flex w-auto translate-y-2 scale-95 items-center rounded-[10px] border border-[var(--chat-border)]/40 bg-sidebar/80 p-1 text-xs text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            <button
              className="cursor-pointer rounded-md bg-sidebar p-1.5 hover:bg-muted/50 disabled:opacity-50"
              data-action="pin-thread"
              aria-label="Pin thread"
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? (
                <PinOff className="size-4" />
              ) : (
                <Pin className="size-4" />
              )}
            </button>
          </div>
        </div>
      </TooltipTrigger>
      {model.byok && !isConfigured && (
        <TooltipContent
          side="top"
          sideOffset={8}
          className="text-sm bg-[var(--sidebar-bg)] px-2 py-1 rounded-md text-popover-foreground border border-[var(--chat-border)]/50 max-w-[20rem] text-center"
        >
          To use this model, you need to configure your OpenRouter API key in
          the settings.
        </TooltipContent>
      )}
    </Tooltip>
  );
});
