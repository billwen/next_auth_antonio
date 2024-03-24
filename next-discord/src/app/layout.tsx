import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/theme-provider";
import {ModalProvider} from "@/components/providers/modal-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Next Discord",
  description: "Next discord clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={cn(
        "min-h-screen min-w-screen font-sans antialiased bg-white dark:bg-[#313338]",
        inter.className
      )}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange storageKey="next-discord-theme">
          <ModalProvider />
          {children}
        </ThemeProvider>

      </body>
      </html>
    </ClerkProvider>

  );
}
