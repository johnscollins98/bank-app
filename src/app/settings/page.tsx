import { getUserSettingsCached } from "@/lib/queries/user-settings";
import getUserAccount from "@/lib/user";
import Navbar from "../_components/navbar";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const { user } = await getUserAccount();
  const settings = await getUserSettingsCached(user.id);

  return (
    <div>
      {/* TODO - this should really be in a layout */}
      <Navbar showHome />
      <div className="pl-safe pr-safe pb-safe pt-4">
        <SettingsForm userSettings={settings} />
      </div>
    </div>
  );
}
