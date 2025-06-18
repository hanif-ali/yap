import { cn } from "@/lib/utils";
import { ModelDefinition } from "@/lib/models/models";
import {
  ImageCapabilityIcon,
  ReasoningCapabilityIcon,
  TextCapabilityIcon,
} from "./capabilities-icons";
import { providerLogos } from "@/lib/models/provider-logos";
import { memo } from "react";

interface ModelItemProps {
  model: ModelDefinition;
  onClick?: () => void;
  isConfigured: boolean;
}

export const ListModelItem = memo(function ListModelItem({ 
  model, 
  onClick,
  isConfigured 
}: ModelItemProps) {
  const enabled = model.enabled && (isConfigured || !model.byok);

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 rounded-md px-2",
        {
          "cursor-pointer hover:bg-background": enabled,
          "opacity-50 cursor-not-allowed": !enabled,
        }
      )}
      onClick={enabled ? onClick : undefined}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          {providerLogos[model.provider as keyof typeof providerLogos] ??
            providerLogos["default"]}
        </div>
        <span className="text-muted-foreground">{model.name}</span>
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
      <div className="flex items-center gap-2">
        {model.inputCapabilities.includes("image") && <ImageCapabilityIcon />}
        {model.inputCapabilities.includes("text") && <TextCapabilityIcon />}
        {model.reasoning && <ReasoningCapabilityIcon />}
      </div>
    </div>
  );
});
