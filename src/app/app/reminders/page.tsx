"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, BellOff, Check, Clock3, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function localDateTimeInput(date: Date) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return adjusted.toISOString().slice(0, 16);
}

export default function RemindersPage() {
  const { t, locale } = useLocale();
  const { data, addReminder, updateReminder, toggleReminder } = useDemoData();
  const [enabled, setEnabled] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [spaceId, setSpaceId] = useState(data.spaces[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const reminders = useMemo(() => data.reminders.filter((reminder) => showDone || !reminder.done).sort((a, b) => a.dueAt.localeCompare(b.dueAt)), [data.reminders, showDone]);
  const formatDateTime = (value: string) => {
    if (!hydrated) return value.replace("T", " · ");
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
  };
  const beginCreate = () => {
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 1, 0, 0, 0);
    setTitle(""); setDueAt(localDateTimeInput(defaultTime)); setSpaceId(data.spaces[0]?.id ?? ""); setOpen(true);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !dueAt || !spaceId) return;
    addReminder(title.trim(), dueAt, spaceId);
    setOpen(false);
    toast.success(t("reminderAdded"));
  };
  const snooze = (reminderId: string, value: string) => {
    const next = new Date(value);
    next.setDate(next.getDate() + 1);
    updateReminder(reminderId, localDateTimeInput(next));
    toast.message(t("snoozedUntilTomorrow"));
  };

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("reminders")} description={locale === "fa" ? "یادآورهای محلی برای کارهای شخصی و گروهی بساز و مدیریت کن." : "Create and manage browser-local reminders for your tasks and groups."} action={<Button onClick={beginCreate}><Plus className="size-4" />{t("setReminder")}</Button>} />
    <Card className="mb-6 flex flex-col gap-4 border-brand/15 bg-brand-soft/35 p-5 sm:flex-row sm:items-center"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-brand shadow-sm">{enabled ? <Bell className="size-5" /> : <BellOff className="size-5" />}</span><div className="flex-1"><p className="mb-1 text-sm font-bold">{t("notifications")}</p><p className="mb-0 text-xs leading-6 text-muted">{t("notificationsPreview")}</p></div><Badge variant={enabled ? "success" : "neutral"}>{enabled ? (locale === "fa" ? "نمایشی روشن" : "Demo on") : (locale === "fa" ? "غیرفعال" : "Off")}</Badge><Button variant="outline" size="sm" onClick={() => { setEnabled((value) => !value); toast.message(t("notificationsPreview")); }}>{enabled ? t("close") : (locale === "fa" ? "فعال‌سازی نمایشی" : "Enable demo")}</Button></Card>
    <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="mb-1 text-base font-bold">{showDone ? t("filterDone") : t("upcoming")}</h2><p className="mb-0 text-xs text-muted">{locale === "fa" ? "یادآورها فقط در این مرورگر ذخیره می‌شوند." : "Reminders are stored in this browser only."}</p></div><Button variant="secondary" size="sm" onClick={() => setShowDone((value) => !value)}>{showDone ? t("filterOpen") : t("filterDone")}</Button></div>
    {reminders.length ? <div className="grid gap-3">{reminders.map((reminder, index) => {
      const space = data.spaces.find((item) => item.id === reminder.spaceId);
      return <Card key={reminder.id} className={cn("flex items-center gap-3 p-4 sm:gap-4 sm:p-5", reminder.done && "opacity-70")}><span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-xl", index === 0 && !reminder.done ? "bg-amber-50 dark:bg-amber-950/50" : "bg-brand-soft")}>{space?.emoji ?? "⏰"}</span><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><h3 className={cn("mb-0 truncate text-sm font-bold", reminder.done && "text-muted line-through")}>{locale === "fa" ? reminder.titleFa : reminder.titleEn}</h3>{index === 0 && !reminder.done && <Badge variant="warning">{t("upcoming")}</Badge>}</div><p className="mb-0 text-[11px] text-muted">{space ? (locale === "fa" ? space.nameFa : space.nameEn) : ""} · <time dateTime={reminder.dueAt}>{formatDateTime(reminder.dueAt)}</time></p></div><div className="flex items-center gap-1.5"><Button variant={reminder.done ? "outline" : "secondary"} size="sm" onClick={() => { toggleReminder(reminder.id); toast.success(reminder.done ? t("open") : t("markDone")); }}><Check className="size-3.5" /><span className="hidden sm:inline">{reminder.done ? t("open") : t("markDone")}</span></Button>{!reminder.done && <Button variant="ghost" size="icon" className="size-9" aria-label={t("snooze")} onClick={() => snooze(reminder.id, reminder.dueAt)}><Clock3 className="size-4" /></Button>}</div></Card>;
    })}</div> : <Card className="grid min-h-48 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950"><Check className="size-5" /></span><h3 className="mb-1 text-sm font-bold">{showDone ? t("noResults") : (locale === "fa" ? "یادآوری تازه‌ای نداری" : "No reminders yet")}</h3><p className="mb-0 text-xs text-muted">{t("emptyItemsHelp")}</p><Button className="mt-4" onClick={beginCreate}><Plus className="size-4" />{t("setReminder")}</Button></div></Card>}
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" /><div><p className="mb-1 text-xs font-bold">{locale === "fa" ? "یادآور محلی، نه اعلان سیستمی" : "In-app reminder, not a system notification"}</p><p className="mb-0 text-[11px] leading-5 text-muted">{t("localOnly")} {t("notificationsPreview")}</p></div><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{t("setReminder")}</DialogTitle><DialogDescription>{t("notificationsPreview")}</DialogDescription></DialogHeader><form className="grid gap-4" onSubmit={submit}><label className="grid gap-2 text-xs font-semibold">{t("reminderTitle")}<Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required autoFocus /></label><label className="grid gap-2 text-xs font-semibold">{t("reminderDateTime")}<Input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} required /></label><label className="grid gap-2 text-xs font-semibold">{t("spaces")}<select value={spaceId} onChange={(event) => setSpaceId(event.target.value)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">{data.spaces.map((space) => <option key={space.id} value={space.id}>{locale === "fa" ? space.nameFa : space.nameEn}</option>)}</select></label><div className="rounded-xl bg-soft/60 p-3 text-[11px] leading-5 text-muted">{t("localOnly")}</div><Button type="submit">{t("save")}</Button></form></DialogContent></Dialog>
  </div>;
}
