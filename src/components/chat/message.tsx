import { Doc } from "../../../convex/_generated/dataModel";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

export function Message({ message }: { message: Doc<"messages"> }) {
  if (message.role === "system") return null;
  return message.role === "user" ? <UserMessage message={message} /> : <AssistantMessage message={message} />;
}
