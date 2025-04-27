"use client";

import { Spinner } from "@heroui/react";
import { useProgressContext } from "../_contexts/progress";

export const GlobalPageLoader = () => {
  const { loading } = useProgressContext();

  if (!loading) return null;

  return (
    <div className="absolute z-[99] w-full py-[inherit] md:top-5">
      <div className="flex justify-center">
        <Spinner size="sm" />
      </div>
    </div>
  );
};
