"use client";

import { Button, Spinner, Tooltip } from "@heroui/react";
import { signOut } from "next-auth/react";
import { startTransition, useOptimistic } from "react";
import { MdHome, MdLogout, MdSettings } from "react-icons/md";
import { ButtonLink } from "./button-link";

export default function LogoutForm({
  showSettings = false,
  showHome = false,
}: {
  showSettings?: boolean;
  showHome?: boolean;
}) {
  const [loggingOut, setLoggingOut] = useOptimistic(false);
  const logoutHandler = () => {
    startTransition(async () => {
      setLoggingOut(true);
      await signOut();
    });
  };

  return (
    <div className="flex gap-2">
      {showHome && (
        <Tooltip content="Home">
          <ButtonLink
            href="/"
            size="sm"
            className="min-w-0"
            prefetch
            aria-label="Home"
          >
            <MdHome />
          </ButtonLink>
        </Tooltip>
      )}
      {showSettings && (
        <Tooltip content="Settings">
          <ButtonLink
            href="/settings"
            size="sm"
            className="min-w-0"
            prefetch
            aria-label="Settings"
          >
            <MdSettings />
          </ButtonLink>
        </Tooltip>
      )}
      <Tooltip content="Log out">
        <Button
          size="sm"
          href="/api/auth/signout"
          onPress={logoutHandler}
          className="w-9 min-w-9"
          aria-label="Log out"
          isDisabled={loggingOut}
        >
          {loggingOut ? <Spinner size="sm" /> : <MdLogout />}
        </Button>
      </Tooltip>
    </div>
  );
}
