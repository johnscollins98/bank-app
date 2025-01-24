"use client";

import { User } from "@/lib/user";
import { Button } from "@nextui-org/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MdLogout } from "react-icons/md";

export default function LogoutForm({
  user,
  showSettings = false,
}: {
  user: User;
  showSettings?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      Hello, {user.name?.split(" ")[0]}
      <div className="flex gap-2">
        {showSettings && (
          <Button as={Link} href="/settings" size="sm">
            Settings
          </Button>
        )}
        <Button size="sm" onPress={() => signOut()}>
          <MdLogout />
        </Button>
      </div>
    </div>
  );
}
