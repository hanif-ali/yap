import { getCurrentUserConfig } from "@/lib/auth";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Settings } from "@/components/settings/settings";

export default async function SettingsPage() {
  const userConfig = await getCurrentUserConfig();

  if (userConfig.isAnonymous) {
    return <RedirectToSignIn redirectUrl={"/settings"} />;
  }

  return <Settings />;
}
