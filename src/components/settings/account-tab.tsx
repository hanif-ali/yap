"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserConfig } from "@/providers/user-config-provider";

export function AccountTab() {
  const { userConfig } = useUserConfig();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground mb-6">
          Manage your account information and preferences.
        </p>
      </div>

      <Card className="bg-transparent border-none">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Full Name
              </label>
              <Input
                id="firstName"
                defaultValue={userConfig.fullName || ""}
                className="focus-visible:ring-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              defaultValue={userConfig.email}
              disabled
              className="focus:border-none focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              OpenRouter API Key
            </label>
            <Input
              id="openRouterKey"
              type="text"
              defaultValue={userConfig.openRouterKey ?? ""}
              className="focus:border-none focus:ring-0"
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
} 