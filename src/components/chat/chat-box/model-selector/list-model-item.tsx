import { cn } from "@/lib/utils";
import { ModelDefinition } from "@/lib/models/models";
import {
  ImageCapabilityIcon,
  ReasoningCapabilityIcon,
  TextCapabilityIcon,
  WebCapabilityIcon,
} from "./capabilities-icons";

interface ModelItemProps {
  name: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  capabilities?: ModelDefinition["capabilities"];
  onClick?: () => void;
  allowed: boolean;
}

export function ListModelItem({
  name,
  icon,
  isPremium,
  capabilities = [],
  onClick,
  allowed,
}: ModelItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 cursor-pointer hover:bg-background rounded-md px-2",
        {
          "opacity-50": !allowed,
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className="text-muted-foreground">{name}</span>
        {isPremium && <span className="text-yellow-500 text-xs">♦</span>}
      </div>
      <div className="flex items-center gap-2">
        {capabilities.includes("image") && <ImageCapabilityIcon />}
        {capabilities.includes("web") && <WebCapabilityIcon />}
        {capabilities.includes("text") && <TextCapabilityIcon />}
        {capabilities.includes("reasoning") && <ReasoningCapabilityIcon />}
      </div>
    </div>
  );
}
