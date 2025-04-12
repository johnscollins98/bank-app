"use client";

import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";

export default function Forbidden() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        You do not have permission to view this page.
        <Button onPress={() => signOut({ redirect: true, callbackUrl: "/" })}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
