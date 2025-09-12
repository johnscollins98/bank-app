import { getUserSettingsCached } from "@/lib/queries/user-settings";
import getUserAccount from "@/lib/user";
import LogoutForm from "../_components/logout-form";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const { user } = await getUserAccount();
  const settings = await getUserSettingsCached(user.id);

  return (
    <div>
      {/* TODO - this should really be in a layout */}
      <div className="pt-safe pl-safe pr-safe bg-gradient-to-br from-pink-600 to-purple-800 pb-4 shadow-md">
        <LogoutForm />
      </div>
      <div className="pl-safe pr-safe pb-safe pt-4">
        <SettingsForm userSettings={settings} />
      </div>
    </div>
  );
}
