"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const onReset = () =>
    startTransition(() => {
      reset();
      router.refresh();
    });

  return (
    <div className="flex h-dvh flex-1 flex-col items-center justify-center gap-8">
      <h1 className="text-xl font-bold">Something went wrong!</h1>
      {process.env.NODE_ENV === "development" && <div>{error.message}</div>}
      {"digest" in error && typeof error.digest === "string" && (
        <div>You can report issues with digest {error.digest}</div>
      )}
      <Button onPress={onReset}>Please try again</Button>
    </div>
  );
}
