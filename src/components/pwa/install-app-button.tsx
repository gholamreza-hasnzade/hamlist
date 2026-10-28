"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/providers/locale-provider";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

export function InstallAppButton() {
  const { t, locale } = useLocale();
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setPromptEvent(null); };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!promptEvent && !isIOS)) return null;

  const install = async () => {
    if (!promptEvent) { setOpen(true); return; }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    if (choice.outcome === "accepted") toast.success(locale === "fa" ? "درخواست نصب پذیرفته شد." : "Install request accepted.");
  };

  return <>
    <Button variant="outline" size="icon" className="size-9 sm:w-auto sm:px-3" aria-label={t("install")} title={t("install")} onClick={install}>
      {isIOS && !promptEvent ? <Smartphone className="size-4" /> : <Download className="size-4" />}
      <span className="hidden text-xs sm:inline">{t("install")}</span>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <span className="mb-1 grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Smartphone className="size-5" /></span>
          <DialogTitle>{locale === "fa" ? "افزودن HamList به صفحهٔ اصلی" : "Add HamList to your Home Screen"}</DialogTitle>
          <DialogDescription>{t("installHelp")}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-line bg-surface-soft p-4 text-sm leading-7 text-muted">
          {isIOS ? t("installIOS") : locale === "fa" ? "از منوی مرورگر، گزینهٔ نصب یا افزودن به صفحهٔ اصلی را انتخاب کن." : "Use your browser menu and choose Install or Add to Home Screen."}
        </div>
        <Button className="mt-4 w-full" variant="secondary" onClick={() => setOpen(false)}>{t("close")}</Button>
      </DialogContent>
    </Dialog>
  </>;
}
