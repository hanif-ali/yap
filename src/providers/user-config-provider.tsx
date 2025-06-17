"use client";

import React, { createContext, useContext } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface UserConfigContextType {
  userConfig: Doc<"userConfigs">;
  updateOpenRouterKey: (key: string) => Promise<void>;
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

  const updateOpenRouterKey = async (openRouterKey: string) => {
    try {
      await updateConfig({ openRouterKey });
    } catch (error) {
      console.error("Failed to update config:", error);
      throw error;
    }
  };

  const contextValue: UserConfigContextType = {
    userConfig,
    updateOpenRouterKey,
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
