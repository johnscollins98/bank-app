"use client";

import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";

export const Theme = ({ children }: PropsWithChildren) => {
  const { systemTheme } = useTheme();
  return (
    <div className={`${systemTheme} text-foreground bg-background`}>
      {children}
    </div>
  );
};
