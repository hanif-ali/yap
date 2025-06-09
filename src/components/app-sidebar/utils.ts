import { isToday, isYesterday, isThisWeek } from "date-fns";
import { Doc } from "../../../convex/_generated/dataModel";

export function categorizeThreads(chats: Doc<"threads">[]) {
  return chats.reduce(
    (acc, chat) => {
      const creationTime = new Date(chat.createdAt);
      let category;

      if (isToday(creationTime)) {
        category = "Today";
      } else if (isYesterday(creationTime)) {
        category = "Yesterday";
      } else if (isThisWeek(creationTime)) {
        category = "Last Week";
      } else {
        category = "Older";
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(chat);
      return acc;
    },
    {} as Record<string, typeof chats>
  );
}