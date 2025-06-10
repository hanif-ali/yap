import { Doc } from "../../../convex/_generated/dataModel";

export function UserMessage({ message }: { message: Doc<"messages"> }) {
  return (
    <div className="flex justify-end">
      <div className="bg-gray-700 rounded-lg p-4 max-w-xs">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
