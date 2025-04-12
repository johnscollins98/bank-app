"use client";

import { User } from "@/lib/user";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MdLogout, MdSettings } from "react-icons/md";

export default function LogoutForm({
  user,
  showSettings = false,
}: {
  user: User;
  showSettings?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {showSettings && (
        <Tooltip content="Settings">
          <Button
            as={Link}
            href="/settings"
            size="sm"
            className="min-w-0"
            prefetch
            aria-label="Settings"
          >
            <MdSettings />
          </Button>
        </Tooltip>
      )}
      <Tooltip content="Log out">
        <Button
          size="sm"
          onPress={() => signOut()}
          className="min-w-0"
          aria-label="Log out"
        >
          <MdLogout />
        </Button>
      </Tooltip>
    </div>
  );
}
