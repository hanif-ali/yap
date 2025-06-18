"use server";

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const getAuthToken = async () => {
  const authData = await auth();
  try {
    return (await authData.getToken({ template: "convex" })) ?? undefined;
  } catch (error) {
    return undefined;
  }
};

export const getCurrentUserConfig = async () => {
  const token = await getAuthToken();

  const anonId = (await headers()).get("x-anon-id");

  return (await fetchMutation(
    api.userConfigs.getOrCreateUserConfig,
    {
      anonId: anonId!,
    },
    { token: token }
  ))!;
};
