"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}
