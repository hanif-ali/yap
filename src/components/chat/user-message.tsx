import { Doc } from "../../../convex/_generated/dataModel";

export function UserMessage({ message }: { message: Doc<"messages"> }) {
	// TODO: white glow around the border
  return (
    <div className="flex justify-end">
      <div className="rounded-xl p-4 max-w-xs bg-secondary/50 border-secondary/50">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
