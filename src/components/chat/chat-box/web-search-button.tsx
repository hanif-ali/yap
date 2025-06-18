import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getModelDefinition, ModelDefinition } from "@/lib/models/models";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useMemo, memo } from "react";

function WebSearchButtonComponent({
  selectedModel,
  searchEnabled,
  setSearchEnabled,
}: {
  selectedModel: ModelDefinition["key"];
  searchEnabled: boolean;
  setSearchEnabled: (value: boolean) => void;
}) {
  const modelDefinition = useMemo(
    () => getModelDefinition(selectedModel),
    [selectedModel]
  );
  console.log({ searchEnabled });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setSearchEnabled(!searchEnabled)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-muted-foreground max-sm:p-2",
            {
              "border-reflect": searchEnabled,
              "cursor-not-allowed": !modelDefinition?.tools,
              "opacity-50": !modelDefinition?.tools,
            }
          )}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm max-sm:sr-only">Web Search</span>
        </button>
      </TooltipTrigger>
      {!modelDefinition?.tools && (
        <TooltipContent
          side="top"
          sideOffset={8}
          className="text-sm bg-[var(--sidebar-bg)] px-2 py-1 rounded-md text-popover-foreground border border-[var(--chat-border)]/50 max-w-[20rem] text-center"
        >
          This model does not support tool calling
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export const WebSearchButton = memo(WebSearchButtonComponent);
