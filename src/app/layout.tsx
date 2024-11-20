import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PullToRefresh } from "./_components/pull-to-refresh";
import { Theme } from "./_components/Theme";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bank App",
  description: "Application to help budget with my bank",
  icons: "/icon.png",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={`${inter.className} flex flex-col`}>
        <Providers>
          <PullToRefresh />
          <Theme>{children}</Theme>
        </Providers>
      </body>
    </html>
  );
}
