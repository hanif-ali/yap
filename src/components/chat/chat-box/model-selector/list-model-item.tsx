import { cn } from "@/lib/utils";
import { ModelDefinition } from "@/lib/models/models";
import { Eye, Globe, FileText, Brain, ImageIcon } from "lucide-react";

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
        {capabilities.includes("vision") && (
          <div className="bg-gray-700 rounded-full p-1" style={{"--colorDark" : "hsl(168 54% 74%)", "--color": "hsl(168 54% 52%)"}}>
            <Eye className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("web") && (
          <div className="bg-gray-700 rounded-full p-1">
            <Globe className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("text") && (
          <div className="bg-gray-700 rounded-full p-1">
            <FileText className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("reasoning") && (
          <div className="bg-gray-700 rounded-full p-1">
            <Brain className="h-4 w-4 text-gray-300" />
          </div>
        )}
        {capabilities.includes("image") && (
          <div className="bg-gray-700 rounded-full p-1">
            <ImageIcon className="h-4 w-4 text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}