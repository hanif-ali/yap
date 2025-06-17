"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThreadHistory } from "./thread-history";
import { Preloaded } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { SidebarControls } from "./sidebar-controls";
import { YapIcon, MenuIcon } from "../icons";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { useUserConfig } from "@/hooks/use-user-config";

export function AppSidebar({
  preloadedThreads,
}: {
  preloadedThreads: Preloaded<typeof api.threads.getForCurrentUser>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const { userConfig } = useUserConfig();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex pt-2.5 items-center justify-center">
          <Link
            className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
            href="/"
            data-discover="true"
          >
            <div className="h-4 select-none">
              {/* <T3Logo /> */}
              <YapIcon />
            </div>
          </Link>
        </div>
        <SidebarControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <ThreadHistory
          preloadedThreads={preloadedThreads}
          searchQuery={searchQuery}
        />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          {userConfig?.isAnonymous || !user ? (
            // Show login button for anonymous users or when user is not signed in
            <div className="flex items-center justify-center">
              <SignInButton>
                <Button variant="default" size="sm" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          ) : (
            // Show user profile for authenticated users
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.firstName?.[0]?.toUpperCase() ||
                    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {user?.fullName ||
                      user?.emailAddresses?.[0]?.emailAddress ||
                      "User"}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 focus:outline-none focus-visible:ring-0"
                  >
                    <MenuIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <SignOutButton>Sign Out</SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
