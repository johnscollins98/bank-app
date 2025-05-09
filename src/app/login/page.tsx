"use client";

import { Button } from "@heroui/button";
import { signIn } from "next-auth/react";
import { startTransition, useOptimistic } from "react";

export default function Login() {
  const [signingIn, setSigningIn] = useOptimistic(false);
  const signInHandler = () => {
    startTransition(async () => {
      setSigningIn(true);
      await signIn("google", { callbackUrl: "/" });
    });
  };

  return (
    <div className="flex h-dvh flex-1 flex-col items-center justify-center gap-5">
      Please sign in to use this application.
      <Button
        onPress={signInHandler}
        isDisabled={signingIn}
        isLoading={signingIn}
      >
        Sign In
      </Button>
    </div>
  );
}
