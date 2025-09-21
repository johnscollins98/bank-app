"use client";

import { Button } from "@heroui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
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
    <div className="flex h-lvh flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-br from-pink-600 to-purple-800 pb-4">
      <div className="flex flex-col items-center gap-3">
        <Image src="/icon.png" alt="icon" width={150} height={150} />
        <div className="flex justify-center text-center text-7xl font-bold text-blue-100">
          Banko
        </div>
      </div>
      <Button
        onPress={signInHandler}
        isDisabled={signingIn}
        isLoading={signingIn}
        color="primary"
        className="w-40"
      >
        Sign In
      </Button>
    </div>
  );
}
