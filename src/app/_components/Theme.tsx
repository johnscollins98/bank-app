"use client";

import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";

export const Theme = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme} bg-background text-foreground`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
