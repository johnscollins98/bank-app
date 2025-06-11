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
      <div>{error.message}</div>
      <Button onPress={onReset}>Please try again</Button>
    </div>
  );
}
