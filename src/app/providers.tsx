"use client";

import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/providers/settings-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        {children}
        <BottomNav />
        <Toaster position="top-center" richColors />
      </SettingsProvider>
    </ThemeProvider>
  );
}
