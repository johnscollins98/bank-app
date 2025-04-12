"use client";

import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";

export const Theme = ({ children }: PropsWithChildren) => {
  const { systemTheme } = useTheme();
  return (
    <div
      className={`${systemTheme} bg-background text-foreground`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
