import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bank App',
  description: 'Application to help budget with my bank',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-[100dvh] flex flex-col bg-slate-800 text-white`}>
        {children}
      </body>
    </html>
  );
}
