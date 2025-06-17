import { TopBar } from "@/components/top-bar";
import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      <TopBar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Settings</h1>
          <SettingsForm />
        </div>
      </div>
    </main>
  );
} 