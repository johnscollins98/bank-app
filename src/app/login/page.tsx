"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex h-dvh flex-1 flex-col items-center justify-center gap-5">
      Please sign in to use this application.
      <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Sign in
      </Button>
    </div>
  );
}
