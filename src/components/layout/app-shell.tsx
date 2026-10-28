"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Bell, Check, CircleHelp, Grid2X2, Home, ListChecks, Moon, Plus, Search, Settings2, Sun, WalletCards, type LucideIcon } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import type { DemoList } from "@/lib/demo-data";
import type { TranslationKey } from "@/lib/i18n";

type NavItem = { href: string; key: TranslationKey; icon: LucideIcon; exact?: boolean };
const nav: NavItem[] = [
  { href: "/app", key: "home" as const, icon: Home, exact: true },
  { href: "/app/spaces", key: "spaces" as const, icon: Grid2X2 },
  { href: "/app/tasks", key: "tasks" as const, icon: ListChecks },
  { href: "/app/reminders", key: "reminders" as const, icon: Bell },
  { href: "/app/expenses", key: "expenses" as const, icon: WalletCards },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const { data, createList } = useDemoData();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && theme === "dark";
  const [newListOpen, setNewListOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const openNewList = () => setNewListOpen(true);
    const offerUpdate = () => {
      toast(t("updateAvailable"), {
        action: {
          label: locale === "fa" ? "به‌روزرسانی" : "Update",
          onClick: async () => {
            const registration = await navigator.serviceWorker.getRegistration("/");
            if (!registration?.waiting) return;
            navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
            registration.waiting.postMessage("HAMLIST_SKIP_WAITING");
          },
        },
      });
    };
    window.addEventListener("hamlist:new-list", openNewList);
    window.addEventListener("hamlist:pwa-update", offerUpdate);
    return () => {
      window.removeEventListener("hamlist:new-list", openNewList);
      window.removeEventListener("hamlist:pwa-update", offerUpdate);
    };
  }, [locale, t]);

  const active = (item: NavItem) => item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/app/spaces?search=${encodeURIComponent(query.trim())}`);
  };
  const submitNewList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const spaceId = String(form.get("spaceId") || data.spaces[0]?.id);
    const kind = String(form.get("kind") || "general") as DemoList["kind"];
    if (!name || !spaceId) return;
    const id = createList({ spaceId, name, kind });
    setNewListOpen(false);
    toast.success(locale === "fa" ? "فهرست نمونه ساخته شد." : "Sample list created.");
    router.push(`/app/lists/${id}`);
  };

  return (
    <div className="app-background min-h-screen">
      <header className="app-header sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-xl md:px-7">
        <div className="flex min-w-0 items-center gap-3 lg:w-[252px]">
          <Link href="/app" className="flex items-center gap-3" aria-label={t("appName")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#8a77d2] to-[#6651b1] text-white shadow-[0_8px_20px_rgba(105,85,184,.24)]"><Check className="size-5 stroke-[3]" /></span>
            <span className="hidden sm:block"><strong className="block text-[15px] leading-5">{t("appName")}</strong><small className="block text-[10px] text-muted">{t("subtitle")}</small></span>
          </Link>
        </div>
        <form onSubmit={submitSearch} className="hidden w-full max-w-[420px] items-center md:flex">
          <label className="relative w-full"><Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} className="h-10 rounded-xl border-transparent bg-soft/65 ps-10 shadow-none focus-visible:border-brand/25" /></label>
          <kbd className="ms-[-54px] z-10 hidden rounded-md border border-line bg-surface px-1.5 py-1 text-[9px] text-muted xl:block">⌘ K</kbd>
        </form>
        <div className="flex items-center gap-2.5">
          <Badge variant="neutral" className="hidden border-0 bg-soft text-muted sm:inline-flex"><span className="me-1 size-1.5 rounded-full bg-violet-500" />{t("demo")}</Badge>
          <Button variant="default" size="sm" className="hidden rounded-xl sm:inline-flex" onClick={() => setNewListOpen(true)}><Plus className="size-4" />{t("newList")}</Button>
          <InstallAppButton />
          <Button variant="outline" size="icon" className="size-9" aria-label={locale === "fa" ? "تغییر زبان" : "Change language"} onClick={() => setLocale(locale === "fa" ? "en" : "fa")}><span className="text-[11px] font-bold">{locale === "fa" ? "EN" : "فا"}</span></Button>
          <Button variant="outline" size="icon" className="size-9" aria-label={isDark ? (locale === "fa" ? "تم روشن" : "Light theme") : (locale === "fa" ? "تم تیره" : "Dark theme")} onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <button className="grid size-9 place-items-center rounded-full border border-line bg-brand-soft text-xs font-bold text-brand" aria-label={t("profile")}>م</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[252px_minmax(0,1fr)]">
        <aside className="sidebar sticky top-[72px] hidden h-[calc(100vh-72px)] flex-col border-e border-line bg-surface/70 px-4 py-6 lg:flex">
          <div className="mb-3 flex items-center justify-between px-3"><span className="text-[11px] font-bold tracking-wide text-muted">{t("workspace")}</span><button className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-soft hover:text-ink" onClick={() => router.push("/app/spaces")} aria-label={t("newSpace")}><Plus className="size-4" /></button></div>
          <nav className="grid gap-1" aria-label={t("workspace")}>
            {nav.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} className={cn("nav-link group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-muted transition", active(item) && "active")}><span className="grid size-8 place-items-center rounded-lg bg-soft/80 text-muted transition group-hover:bg-white/70"><Icon className="size-[17px]" /></span><span>{t(item.key)}</span>{item.key === "tasks" && <span className="ms-auto rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">{data.tasks.filter((task) => !task.done).length}</span>}</Link>; })}
          </nav>
          <div className="mb-3 mt-8 flex items-center justify-between px-3"><span className="text-[11px] font-bold tracking-wide text-muted">{t("recent")}</span><Link href="/app/spaces" className="text-[10px] text-brand hover:underline">{t("viewAll")}</Link></div>
          <nav className="grid gap-1" aria-label={t("recentSpaces")}>
            {data.spaces.slice(0, 4).map((space) => <Link key={space.id} href={`/app/spaces/${space.id}`} className={cn("flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs text-muted transition hover:bg-soft hover:text-ink", pathname.endsWith(`/spaces/${space.id}`) && "bg-soft text-brand")}><span className="grid size-7 place-items-center rounded-lg bg-surface text-base shadow-sm">{space.emoji}</span><span className="truncate">{locale === "fa" ? space.nameFa : space.nameEn}</span><span className="ms-auto text-[10px] text-muted/70">{space.memberCount}</span></Link>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-line bg-soft/50 p-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold"><CircleHelp className="size-4 text-brand" />{t("noBackend").slice(0, 21)}…</div><p className="mb-0 text-[10px] leading-5 text-muted">{t("localOnly")}</p><Link href="/app/settings" className="mt-2 inline-block text-[10px] font-bold text-brand">{t("settings")} ←</Link></div>
        </aside>

        <main className="min-w-0 px-4 pb-28 pt-6 sm:px-6 lg:px-9 lg:pb-12 lg:pt-9">
          <div className="mb-5 flex items-center justify-between gap-3 sm:hidden">
            <div className="min-w-0"><div className="text-[11px] text-muted">{t("demo")}</div><div className="truncate text-sm font-bold">{t("appName")}</div></div>
            <Button variant="default" size="sm" className="shrink-0 rounded-xl" onClick={() => setNewListOpen(true)}><Plus className="size-4" />{t("newList")}</Button>
          </div>
          {children}
        </main>
      </div>

      <nav className="mobile-nav fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 z-40 grid w-[min(410px,calc(100vw-28px))] -translate-x-1/2 grid-cols-4 gap-1.5 rounded-full border border-white/10 bg-[#201e27] p-2 shadow-[0_16px_40px_rgba(30,26,49,.3)] lg:hidden" aria-label={t("workspace")}>
        {[nav[0], nav[1], nav[2], { href: "/app/settings", key: "settings" as const, icon: Settings2 }].map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} className={cn("grid h-[50px] place-items-center rounded-full text-white/55 transition", active(item) && "active")} aria-label={t(item.key)} title={t(item.key)}><span className="grid size-9 place-items-center rounded-full transition"><Icon className="size-[19px]" /></span><span className="sr-only">{t(item.key)}</span></Link>; })}
      </nav>

      <Dialog open={newListOpen} onOpenChange={setNewListOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("newList")}</DialogTitle><DialogDescription>{t("noBackend")}</DialogDescription></DialogHeader>
          <form onSubmit={submitNewList} className="grid gap-4">
            <label className="grid gap-2 text-xs font-semibold">{t("listName")}<Input name="name" required maxLength={48} autoFocus placeholder={t("listNamePlaceholder")} /></label>
            <label className="grid gap-2 text-xs font-semibold">{t("chooseSpace")}<select name="spaceId" className="h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink">{data.spaces.map((space) => <option key={space.id} value={space.id}>{locale === "fa" ? space.nameFa : space.nameEn}</option>)}</select></label>
            <label className="grid gap-2 text-xs font-semibold">{t("listType")}<select name="kind" className="h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink"><option value="shopping">{t("shopping")}</option><option value="tasks">{t("household")}</option><option value="travel">{t("trip")}</option><option value="general">{t("general")}</option></select></label>
            <Button type="submit" className="mt-1 w-full">{t("create")}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
