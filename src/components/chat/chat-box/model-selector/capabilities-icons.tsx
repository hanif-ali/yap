import { Brain, Eye, FileText, Globe } from "lucide-react";

export function ImageCapabilityIcon() {
  return (
    <div
      className="rounded-md w-6 h-6 p-1 bg-[var(--vision-icon-color)]/15"
    >
      <Eye className="h-4 w-4 stroke-[var(--vision-icon-color)]" strokeWidth={2}/>
    </div>
  );
}

export function TextCapabilityIcon() {
  return (
    <div className="rounded-md w-6 h-6 p-1 bg-[var(--text-icon-color)]/15">
      <FileText className="h-4 w-4 stroke-[var(--text-icon-color)]" strokeWidth={2}/>
    </div>
  );
} 

export function ReasoningCapabilityIcon() {
  return (
    <div className="rounded-md w-6 h-6 p-1 bg-[var(--reasoning-icon-color)]/15">
      <Brain className="h-4 w-4 stroke-[var(--reasoning-icon-color)]" strokeWidth={2}/>
    </div>
  );
}
