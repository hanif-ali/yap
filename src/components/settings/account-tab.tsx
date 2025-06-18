"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserConfig } from "@/providers/user-config-provider";
import { useState } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, Edit2, Check, X } from "lucide-react";

export function AccountTab() {
  const { userConfig, updateUserConfig } = useUserConfig();
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: userConfig.fullName || "",
      openRouterKey: userConfig.openRouterKey || "",
    },
    onSubmit: async (values) => {
      await updateUserConfig({
        fullName: values.fullName,
        openRouterKey: values.openRouterKey,
      });

      formik.resetForm({ values });
    },
  });

  const handleEditApiKey = () => {
    setIsEditingApiKey(true);
  };

  const handleSaveApiKey = () => {
    formik.setFieldValue("openRouterKey", formik.values.openRouterKey);
    setIsEditingApiKey(false);
    setShowApiKey(false);
  };

  const handleCancelApiKey = () => {
    formik.setFieldValue("openRouterKey", userConfig.openRouterKey || "");
    setIsEditingApiKey(false);
    setShowApiKey(false);
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    return "*".repeat(Math.min(key.length, 20));
  };

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
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  className="focus-visible:ring-none mt-2"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email <span className="italic">(Cannot be changed)</span>
              </label>
              <p className="text-sm">{userConfig.email}</p>
            </div>
            <div className="space-y-2 mt-8">
              <label
                htmlFor="openRouterKey"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                OpenRouter API Key
              </label>
              <div className="flex items-center gap-2 mt-2">
                {isEditingApiKey ? (
                  <>
                    <Input
                      id="openRouterKey"
                      name="openRouterKey"
                      type={showApiKey ? "text" : "password"}
                      value={formik.values.openRouterKey}
                      onChange={formik.handleChange}
                      className="focus:border-none focus:ring-0 flex-1"
                      placeholder="Enter your OpenRouter API key"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-2"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveApiKey}
                      className="px-2 text-green-600 hover:text-green-700"
                    >
                      <Check size={16} />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelApiKey}
                      className="px-2 text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      id="openRouterKey"
                      type="text"
                      value={
                        userConfig.openRouterKey
                          ? maskApiKey(formik.values.openRouterKey)
                          : "No API key set"
                      }
                      disabled
                      className="focus:border-none focus:ring-0 flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleEditApiKey}
                      className="px-2"
                    >
                      <Edit2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8">
              <Button type="submit" disabled={!formik.dirty || !formik.isValid}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
