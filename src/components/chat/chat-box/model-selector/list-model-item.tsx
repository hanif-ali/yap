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
}

export const ListModelItem = memo(function ListModelItem({ model, onClick }: ModelItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 cursor-pointer hover:bg-background rounded-md px-2",
        {
          "opacity-50": !model.enabled,
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          {providerLogos[model.provider as keyof typeof providerLogos] ??
            providerLogos["default"]}
        </div>
        <span className="text-muted-foreground">{model.name}</span>
        {/* {model.isPremium && <span className="text-yellow-500 text-xs">♦</span>} */}
      </div>
      <div className="flex items-center gap-2">
        {model.inputCapabilities.includes("image") && <ImageCapabilityIcon />}
        {model.inputCapabilities.includes("text") && <TextCapabilityIcon />}
        {model.reasoning && <ReasoningCapabilityIcon />}
      </div>
    </div>
  );
});
