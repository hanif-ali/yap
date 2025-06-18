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
import Link from "next/link";
import { SidebarControls } from "./sidebar-controls";
import { YapIcon, MenuIcon } from "../icons";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { useUserConfig } from "@/hooks/use-user-config";
// import { ThreadHistory } from "./thread-history";
import { SafeHydrate } from "../safe-hydrate";

import dynamic from "next/dynamic";

const ThreadHistory = dynamic(() => import("./thread-history"), {
  ssr: false,
});

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
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
        <ThreadHistory searchQuery={searchQuery} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          {userConfig?.isAnonymous || false ? (
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
                  {userConfig.fullName[0].toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {userConfig.fullName}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href="/settings">Settings</Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <SignOutButton>
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign Out
                      </Button>
                    </SignOutButton>
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
