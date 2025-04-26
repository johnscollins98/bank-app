"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import { ProgressProvider } from "./_contexts/progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        <ProgressProvider>{children}</ProgressProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
