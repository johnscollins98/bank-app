import { getUserSettingsCached } from "@/lib/queries/user-settings";
import getUserAccount from "@/lib/user";
import LogoutForm from "../_components/logout-form";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const { user } = await getUserAccount();
  const settings = await getUserSettingsCached(user.id);

  return (
    <div className="p-4">
      {/* TODO - this should really be in a layout */}
      <LogoutForm />
      <SettingsForm userSettings={settings} />
    </div>
  );
}
