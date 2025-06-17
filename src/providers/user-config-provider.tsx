"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UserConfigContextType {
  config: any; // Will be properly typed once Convex generates types
  updateOpenRouterKey: (key: string) => Promise<void>;
  removeOpenRouterKey: () => Promise<void>;
  isLoading: boolean;
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

let isCreatingGlobally = false;

export function UserConfigProvider({ children }: { children: React.ReactNode }) {
  const userConfig = useQuery(api.userConfigs.getUserConfig);
  const createConfig = useMutation(api.userConfigs.createUserConfig);
  const updateConfig = useMutation(api.userConfigs.updateUserConfig);
  const deleteKey = useMutation(api.userConfigs.deleteOpenRouterKey);
  
  const [hasAttemptedCreation, setHasAttemptedCreation] = useState(false);

  // Auto-create config if it doesn't exist
  useEffect(() => {
    if (userConfig === null && !isCreatingGlobally && !hasAttemptedCreation) {
      isCreatingGlobally = true;
      setHasAttemptedCreation(true);
      
      createConfig()
        .catch((error) => {
          console.error("Failed to create user config:", error);
          setHasAttemptedCreation(false); // Allow retry on error
        })
        .finally(() => {
          isCreatingGlobally = false;
        });
    }
  }, [userConfig, createConfig, hasAttemptedCreation]);

  const updateOpenRouterKey = async (openRouterKey: string) => {
    try {
      await updateConfig({ openRouterKey });
    } catch (error) {
      console.error("Failed to update config:", error);
      throw error;
    }
  };

  const removeOpenRouterKey = async () => {
    try {
      await deleteKey();
    } catch (error) {
      console.error("Failed to delete key:", error);
      throw error;
    }
  };

  const contextValue: UserConfigContextType = {
    config: userConfig,
    updateOpenRouterKey,
    removeOpenRouterKey,
    isLoading: userConfig === undefined || (userConfig === null && isCreatingGlobally),
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