import { Paintbrush, Palette } from "lucide-react";
import { PopoverContent } from "../ui/popover";
import { Popover, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// Define theme options
const themes = [
  {
    key: "dark",
    name: "Dark",
    description: "T3 Chat Dark",
    color: "#000",
  },
  {
    key: "forest",
    name: "Forest",
    description: "Forest",
    color: "#0d1b2a",
  },
];

interface ThemeItemProps {
  name: string;
  description: string;
  color: string;
  onClick: () => void;
  isSelected: boolean;
}

const ThemeItem = ({
  name,
  description,
  color,
  onClick,
  isSelected,
}: ThemeItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-muted/40 w-full",
        isSelected ? "border-muted-foreground/30 bg-muted/20" : "border-border"
      )}
    >
      <div
        className="size-4 rounded-full border border-border flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-col items-start gap-1">
        <span className="font-medium text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </button>
  );
};

export const ThemeSelector = () => {
  const [open, setOpen] = useState(false);
  const { theme: selectedTheme, setTheme: setSelectedTheme } = useTheme();

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 group relative size-8"
          aria-label="Toggle theme"
        >
          <Paintbrush />
          <span className="sr-only">Toggle theme</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-2 text-white animate-in slide-in-from-bottom-2 duration-200 border-gray-800"
        side="top"
        align="start"
        alignOffset={-20}
      >
        <div className="px-3 pt-4">
          <div className="flex w-full select-none items-center justify-start gap-1.5 text-[var(--heading)] mb-3">
            <Palette className="mt-px size-4" />
            Themes
          </div>
          <div className="flex flex-col gap-2 pb-4">
            {themes.map((theme) => (
              <ThemeItem
                key={theme.key}
                name={theme.name}
                description={theme.description}
                color={theme.color}
                onClick={() => handleThemeSelect(theme.key)}
                isSelected={selectedTheme === theme.key}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
