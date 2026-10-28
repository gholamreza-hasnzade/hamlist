"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Bell, Check, ClipboardList, Clock3, ReceiptText, RotateCcw, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DemoActivity } from "@/lib/demo-data";

type ActivityFilter = DemoActivity["type"] | "all";
const typeIcons = { space: Users, list: ClipboardList, item: Check, task: Check, reminder: Bell, expense: ReceiptText };

export default function ActivityPage() {
  const { t, locale } = useLocale();
  const { data, clearActivity } = useDemoData();
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const entries = useMemo(() => data.activity.filter((entry) => filter === "all" || entry.type === filter).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [data.activity, filter]);
  const labels: Record<ActivityFilter, string> = { all: t("all"), space: t("spaces"), list: t("lists"), item: t("items"), task: t("tasks"), reminder: t("reminders"), expense: t("expenses") };
  const routeFor = (entry: DemoActivity) => entry.type === "task" ? "/app/tasks" : entry.type === "reminder" ? "/app/reminders" : entry.type === "expense" ? "/app/expenses" : entry.type === "space" ? "/app/spaces" : entry.spaceId ? `/app/spaces/${entry.spaceId}` : "/app/spaces";
  const dateLabel = (value: string) => new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const confirmClear = () => { clearActivity(); setConfirmOpen(false); toast.success(locale === "fa" ? "گزارش پاک شد؛ داده‌های اصلی باقی ماندند." : "Activity cleared; your lists and tasks are unchanged."); };
  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("activityLog")} description={t("activityHelp")} action={data.activity.length > 0 ? <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}><Trash2 className="size-4" />{t("clearActivity")}</Button> : undefined} />
    <Card className="mb-5 flex flex-wrap gap-1.5 p-2">{(["all", "space", "list", "item", "task", "reminder", "expense"] as ActivityFilter[]).map((value) => <button key={value} onClick={() => setFilter(value)} className={cn("min-h-9 rounded-lg px-3 text-[11px] font-semibold transition", filter === value ? "bg-brand text-white" : "text-muted hover:bg-soft hover:text-ink")}>{labels[value]}</button>)}</Card>
    {entries.length ? <div className="grid gap-2.5">{entries.map((entry) => { const Icon = typeIcons[entry.type]; const space = entry.spaceId ? data.spaces.find((item) => item.id === entry.spaceId) : undefined; return <Link key={entry.id} href={routeFor(entry)}><Card className="flex items-center gap-3 p-4 transition hover:border-brand/25 sm:gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="mb-1 truncate text-xs"><strong className="font-semibold">{locale === "fa" ? entry.actionFa : entry.actionEn}</strong><span className="text-muted"> · {locale === "fa" ? entry.titleFa : entry.titleEn}</span></p><p className="mb-0 truncate text-[10px] text-muted">{space ? `${locale === "fa" ? space.nameFa : space.nameEn} · ` : ""}{dateLabel(entry.createdAt)}</p></div><Badge variant="neutral" className="hidden sm:inline-flex">{labels[entry.type]}</Badge><Clock3 className="size-4 shrink-0 text-muted sm:hidden" /></Card></Link>; })}</div> : <Card className="grid min-h-56 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><Activity className="size-5" /></span><h2 className="mb-1 text-sm font-bold">{t("noActivity")}</h2><p className="mb-0 max-w-sm text-xs leading-6 text-muted">{t("activityHelp")}</p></div></Card>}
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogContent><DialogHeader><DialogTitle>{t("clearActivityConfirm")}</DialogTitle><DialogDescription>{locale === "fa" ? "فهرست‌ها، کارها و یادآورها پاک نمی‌شوند." : "Your lists, tasks and reminders will not be deleted."}</DialogDescription></DialogHeader><div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>{t("cancel")}</Button><Button variant="destructive" className="flex-1" onClick={confirmClear}><RotateCcw className="size-4" />{t("clearActivity")}</Button></div></DialogContent></Dialog>
  </div>;
}
