import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const vazir = localFont({ src: "../../public/fonts/vazirmatn-variable.woff2", variable: "--font-vazir", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "HamList — Make it happen together", template: "%s · HamList" },
  description: "Shared lists and everyday plans for any small group.",
  applicationName: "HamList",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" suppressHydrationWarning className={vazir.variable}><body><AppProviders>{children}</AppProviders></body></html>;
}
