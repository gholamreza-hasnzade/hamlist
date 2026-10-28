"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/providers/locale-provider";
import { DemoDataProvider } from "@/providers/demo-data-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      <LocaleProvider>
        <DemoDataProvider>{children}</DemoDataProvider>
        <ServiceWorkerRegister />
        <Toaster position="bottom-center" richColors closeButton />
      </LocaleProvider>
    </ThemeProvider>
  );
}
