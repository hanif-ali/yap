import { Doc } from "../../../convex/_generated/dataModel";

export function AssistantMessage({ message }: { message: Doc<"messages"> }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-3xl">
        <p className="text-gray-300 mb-4">{message.content}</p>
      </div>
    </div>
  );
}
