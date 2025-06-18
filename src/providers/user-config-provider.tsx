"use client";

import React, { createContext, useContext } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface UserConfigContextType {
  userConfig: Doc<"userConfigs">;
  updateUserConfig: (userConfig: Partial<Doc<"userConfigs">>) => Promise<void>;
  isLoading: boolean;
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(
  undefined
);

let isCreatingGlobally = false;

export function UserConfigProvider({
  children,
  userConfig,
}: {
  children: React.ReactNode;
  userConfig: Doc<"userConfigs">;
}) {
  const updateConfig = useMutation(api.userConfigs.updateUserConfig);

  const updateUserConfig = async (userConfig: Partial<Doc<"userConfigs">>) => {
    try {
      await updateConfig(userConfig);
      toast.success("User preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update user preferences");
      throw error;
    }
  };

  const contextValue: UserConfigContextType = {
    userConfig,
    updateUserConfig,
    isLoading:
      userConfig === undefined || (userConfig === null && isCreatingGlobally),
  };

  return (
    <UserConfigContext.Provider value={contextValue}>
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig() {
  const context = useContext(UserConfigContext);
  if (!context) {
    throw new Error("useUserConfig must be used within a UserConfigProvider");
  }
  return context;
}
