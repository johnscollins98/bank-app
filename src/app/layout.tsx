import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "./_components/Theme";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bank App",
  description: "Application to help budget with my bank",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <Providers>
          <Theme>{children}</Theme>
        </Providers>
      </body>
    </html>
  );
}
