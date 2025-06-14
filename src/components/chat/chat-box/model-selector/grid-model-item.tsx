import { ModelDefinition } from "@/lib/models/models";
import {
  ImageCapabilityIcon,
  ReasoningCapabilityIcon,
  TextCapabilityIcon,
  WebCapabilityIcon,
} from "./capabilities-icons";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelItemProps {
  name: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  capabilities?: ModelDefinition["capabilities"];
  onClick?: () => void;
  allowed: boolean;
  onFavorite: () => void;
  onUnfavorite: () => void;
  isFavorite: boolean;
}

export function GridModelItem({
  name,
  icon,
  capabilities = [],
  onClick,
  allowed,
  onFavorite,
  onUnfavorite,
  isFavorite,
}: ModelItemProps) {
  const handlePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const renderCapabilities = () => (
    <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
      {capabilities.includes("image") && <ImageCapabilityIcon />}
      {capabilities.includes("web") && <WebCapabilityIcon />}
      {capabilities.includes("text") && <TextCapabilityIcon />}
      {capabilities.includes("reasoning") && <ReasoningCapabilityIcon />}
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
        "cursor-pointer": allowed,
        "opacity-50 cursor-not-allowed": !allowed,
      })}
      data-state="closed"
      onClick={allowed ? onClick : undefined}
    >
      <div className="absolute -left-1.5 -top-1.5 z-10 rounded-full bg-popover p-0.5" />
      <button
        className={cn(
          "group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-xl border border-[var(--chat-border)]/50 bg-sidebar/20 px-2 py-4 text-color-heading [--model-muted:hsl(var(--muted-foreground)/0.9)] [--model-primary:hsl(var(--color-heading))] hover:bg-accent/30 hover:text-color-heading dark:border-[var(--chat-border)] dark:bg-[hsl(320,20%,2.9%)] dark:[--model-muted:hsl(var(--color-heading))] dark:[--model-primary:hsl(var(--muted-foreground)/0.9)] dark:hover:bg-accent/30"
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">{icon}</div>
          <div className="w-full text-center text-[--model-primary]">
            <div className="text-sm font-medium leading-tight">{name}</div>
          </div>
        </div>
        {renderCapabilities()}
      </button>
      <div className="absolute -right-1.5 -top-1.5 left-auto z-50 flex w-auto translate-y-2 scale-95 items-center rounded-[10px] border border-[var(--chat-border)]/40 bg-card p-1 text-xs text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <button
          className="cursor-pointer rounded-md bg-accent/30 p-1.5 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
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
}
