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

interface ModelItemProps {
  model: ModelDefinition;
  onClick?: () => void;
  onFavorite: () => void;
  onUnfavorite: () => void;
  isFavorite: boolean;
}

export const GridModelItem = memo(function GridModelItem({
  model,
  onClick,
  onFavorite,
  onUnfavorite,
  isFavorite,
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

  return (
    <div
      className={cn("group relative", {
        "cursor-pointer": model.enabled,
        "opacity-50 cursor-not-allowed": !model.enabled,
      })}
      data-state="closed"
      onClick={model.enabled ? onClick : undefined}
    >
      <div className="absolute -left-1.5 -top-1.5 z-10 rounded-full bg-popover p-0.5" />
      <button
        className={cn(
          "group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-xl border border-[var(--chat-border)]/50 bg-sidebar/20 px-2 py-4 text-color-heading [--model-muted:hsl(var(--muted-foreground)/0.9)] [--model-primary:hsl(var(--color-heading))] hover:bg-accent/30 hover:text-color-heading dark:border-[var(--chat-border)] dark:bg-[hsl(320,20%,2.9%)] dark:[--model-muted:hsl(var(--color-heading))] dark:[--model-primary:hsl(var(--muted-foreground)/0.9)] dark:hover:bg-accent/30"
        )}
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
          className="cursor-pointer rounded-md bg-sidebar p-1.5 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
});
