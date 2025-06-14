import { ModelDefinition } from "@/lib/models/models";
import {
  ImageCapabilityIcon,
  ReasoningCapabilityIcon,
  TextCapabilityIcon,
  WebCapabilityIcon,
} from "./capabilities-icons";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelItemProps {
  name: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  capabilities?: ModelDefinition["capabilities"];
  onClick?: () => void;
  allowed: boolean;
}

export function GridModelItem({
  name,
  icon,
  capabilities = [],
  onClick,
  allowed,
}: ModelItemProps) {
  const handlePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
      <div className="absolute -left-1.5 -top-1.5 z-10 rounded-full bg-popover p-0.5"></div>
      <button
        className={cn(
          "group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-start gap-0.5 overflow-hidden rounded-xl border border-chat-border/50 bg-sidebar/20 px-1 py-3 text-color-heading [--model-muted:hsl(var(--muted-foreground)/0.9)] [--model-primary:hsl(var(--color-heading))] hover:bg-accent/30 hover:text-color-heading dark:border-chat-border dark:bg-[hsl(320,20%,2.9%)] dark:[--model-muted:hsl(var(--color-heading))] dark:[--model-primary:hsl(var(--muted-foreground)/0.9)] dark:hover:bg-accent/30"
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-1 font-medium transition-colors">
          {icon}
          <div className="w-full text-center text-[--model-primary]">
            <div className="text-base font-semibold">{name}</div>
            <div className="-mt-1 text-[11px] text-[--model-muted]"></div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
          {capabilities.includes("image") && <ImageCapabilityIcon />}
          {capabilities.includes("web") && <WebCapabilityIcon />}
          {capabilities.includes("text") && <TextCapabilityIcon />}
          {capabilities.includes("reasoning") && <ReasoningCapabilityIcon />}
        </div>
      </button>
      <div className="absolute -right-1.5 -top-1.5 left-auto z-50 flex w-auto translate-y-2 scale-95 items-center rounded-[10px] border border-chat-border/40 bg-card p-1 text-xs text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <button
          className="cursor-pointer rounded-md bg-accent/30 p-1.5 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
          data-action="pin-thread"
          aria-label="Pin thread"
          onClick={handlePin}
        >
          <Pin />
        </button>
      </div>
    </div>
  );
}
