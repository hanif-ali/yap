import { isToday, isYesterday, isThisWeek } from "date-fns";
import { Doc } from "../../../convex/_generated/dataModel";

export function categorizeThreads(chats: Doc<"threads">[]) {
  const sortedChats = [...chats].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return sortedChats.reduce((acc, chat) => {
    const creationTime = new Date(chat.createdAt);
    const category = isToday(creationTime) ? "Today" 
      : isYesterday(creationTime) ? "Yesterday"
      : isThisWeek(creationTime) ? "Last Week"
      : "Older";

    if (!acc[category]) acc[category] = [];
    acc[category].push(chat);
    return acc;
  }, {} as Record<string, typeof chats>);
}