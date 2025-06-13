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
  featured?: boolean;
  capabilities?: ModelDefinition["capabilities"];
  onClick?: () => void;
}

export function ListModelItem({
  name,
  icon,
  isPremium,
  featured,
  capabilities = [],
  onClick,
}: ModelItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 cursor-pointer hover:bg-background rounded-md px-2"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className={cn("text-gray-300", featured && "text-white")}>
          {name}
        </span>
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
