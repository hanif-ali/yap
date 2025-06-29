import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import localFont from "next/font/local";
import { UserConfigProvider } from "@/providers/user-config-provider";
import { headers } from "next/headers";
import { getAuthToken } from "@/lib/auth";
import { Toaster } from "sonner";

const proxima_var = localFont({
  src: "./proxima_vara.woff2",
});

export const metadata: Metadata = {
  title: "Yap",
  description: "Open source clone of T3 Chat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getAuthToken();

  const anonId = (await headers()).get("x-anon-id");

  const userConfig = await fetchMutation(
    api.userConfigs.getOrCreateUserConfig,
    {
      // Always available as it is set in middleware
      anonId: anonId!,
    },
    { token: token ?? undefined }
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${proxima_var.className} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="t3-dark"
              themes={["t3-dark", "forest", "ocean", "sunset"]}
            >
              <UserConfigProvider userConfig={userConfig!}>
                {children}
              </UserConfigProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
        <Toaster richColors theme="dark" />
        <Analytics />
      </body>
    </html>
  );
}
