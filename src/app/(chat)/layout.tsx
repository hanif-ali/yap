import { TopBar } from "@/components/top-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      <TopBar />
      {children}
    </main>
  );
}
