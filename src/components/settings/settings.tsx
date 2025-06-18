"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { NoisyBackground } from "../backgrounds";
import { AccountTab } from "./account-tab";
import { CustomizationTab } from "./customization-tab";
import { HistoryTab } from "./history-tab";
import { AboutTab } from "./about-tab";

export const Settings = () => {
  return (
    <div className="flex h-screen text-white">
      <div className="z-1 w-full">
        <SettingsTopBar />
        <Suspense fallback={<div className="p-6">Loading settings...</div>}>
          <SettingsContent />
        </Suspense>
      </div>
      <NoisyBackground />
    </div>
  );
};

export const SettingsTopBar = () => {
  const router = useRouter();

  return (
    <div className="flex h-14 items-center justify-between px-6 pt-4">
      <div>
        <Button
          variant="ghost"
          className="text-md"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SignOutButton>
          <Button variant="ghost" className="text-md">
            Sign out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
};

export function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("customization");

  // Get tab from URL query parameter on component mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["account", "customization", "history", "about"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen p-3 z-1">
      {/* Main Content */}
      <div className="container mx-auto max-w-4xl py-8 px-6 scrollbar-thin overflow-y-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="history">History & Sync</TabsTrigger>
            <TabsTrigger value="about">About Yap</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>

          <TabsContent value="customization">
            <CustomizationTab />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
