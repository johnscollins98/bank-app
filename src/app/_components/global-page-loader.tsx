"use client";

import { Spinner } from "@heroui/react";
import { useProgressContext } from "../_contexts/progress";

export const GlobalPageLoader = () => {
  const { loading } = useProgressContext();

  if (!loading) return null;

  return (
    <div className="z-99 absolute inset-x-1/2 top-5 -translate-x-1/2">
      <Spinner size="sm" />
    </div>
  );
};
