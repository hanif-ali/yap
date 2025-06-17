"use client";

import { useState } from "react";
import { useUserConfig } from "@/hooks/use-user-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

export function SettingsForm() {
  const { config, updateOpenRouterKey, removeOpenRouterKey, isLoading } =
    useUserConfig();
  const [keyValue, setKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      await updateOpenRouterKey(keyValue.trim());
      setMessage({ type: "success", text: "API key updated successfully!" });
      setKeyValue("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update API key. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    setMessage(null);

    try {
      await removeOpenRouterKey();
      setMessage({ type: "success", text: "API key removed successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to remove API key. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasExistingKey = config?.openRouterKey;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenRouter API Configuration</CardTitle>
        <CardDescription>
          Manage your OpenRouter API key for AI model access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <Label>Current Status</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            {hasExistingKey ? (
              <span className="text-green-600 font-medium">
                ✓ API key is configured
              </span>
            ) : (
              <span className="text-gray-600">No API key configured</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{hasExistingKey ? "Update API Key" : "Add API Key"}</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="sk-or-v1-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!keyValue.trim() || isUpdating}
              className="flex-1"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : hasExistingKey ? (
                "Update Key"
              ) : (
                "Save Key"
              )}
            </Button>

            {hasExistingKey && (
              <Button
                type="button"
                variant="destructive"
                disabled={isUpdating}
                onClick={handleRemove}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="text-sm text-gray-600">
          <p>
            Your API key is stored securely and encrypted. You can get an
            OpenRouter API key from{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              openrouter.ai/keys
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
