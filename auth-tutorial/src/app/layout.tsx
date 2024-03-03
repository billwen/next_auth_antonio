import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next auth tutorial",
  description: " by Anton",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider>
      <html lang="en">
      <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>
  );
}
