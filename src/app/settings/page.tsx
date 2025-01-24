import { db } from "@/lib/db";
import getUserAccount from "@/lib/user";
import LogoutForm from "../_components/logout-form";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const { user } = await getUserAccount();
  const settings = await db.userSettings.findFirst({
    where: { userId: user.id },
  });

  return (
    <div className="p-4">
      {/* TODO - this should really be in a layout */}
      <LogoutForm user={user} />
      <SettingsForm userSettings={settings} />
    </div>
  );
}
