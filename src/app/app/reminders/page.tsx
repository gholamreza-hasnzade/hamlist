"use client";

import { useState } from "react";
import { Bell, BellOff, Check, Clock3, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RemindersPage() {
  const { t, locale } = useLocale();
  const [enabled, setEnabled] = useState(false);
  const [snoozed, setSnoozed] = useState<string[]>([]);
  const reminders = locale === "fa" ? [
    { id: "r1", title: "مرتب‌کردن خرید هفتگی", list: "کارهای این هفته", when: "امروز · ساعت ۱۸:۰۰", icon: "🛒", time: "امروز" },
    { id: "r2", title: "آماده‌کردن وسایل پیک‌نیک", list: "سفر آخر هفته", when: "فردا · ساعت ۱۰:۰۰", icon: "✈️", time: "فردا" },
    { id: "r3", title: "پرداخت قبض اینترنت", list: "خانه", when: "پنجشنبه · ساعت ۱۲:۰۰", icon: "⌂", time: "این هفته" },
  ] : [
    { id: "r1", title: "Put away the weekly shop", list: "This week’s tasks", when: "Today · 6:00 PM", icon: "🛒", time: "Today" },
    { id: "r2", title: "Pack picnic supplies", list: "Weekend trip", when: "Tomorrow · 10:00 AM", icon: "✈️", time: "Tomorrow" },
    { id: "r3", title: "Pay the internet bill", list: "Home", when: "Thursday · 12:00 PM", icon: "⌂", time: "This week" },
  ];
  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("reminders")} description={locale === "fa" ? "یادآوری‌های نمایشی مربوط به کارهای نزدیک موعد." : "A clear view of the demo reminders coming up."} action={<Button variant={enabled ? "secondary" : "default"} onClick={() => { setEnabled((value) => !value); toast.message(t("notificationsPreview")); }}><Bell className="size-4" />{t("reminderSettings")}</Button>} />
    <Card className="mb-6 flex flex-col gap-4 border-brand/15 bg-brand-soft/35 p-5 sm:flex-row sm:items-center"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-brand shadow-sm">{enabled ? <Bell className="size-5" /> : <BellOff className="size-5" />}</span><div className="flex-1"><p className="mb-1 text-sm font-bold">{t("notifications")}</p><p className="mb-0 text-xs leading-6 text-muted">{t("notificationsPreview")}</p></div><Badge variant={enabled ? "success" : "neutral"}>{enabled ? (locale === "fa" ? "نمایشی روشن" : "Demo on") : (locale === "fa" ? "غیرفعال" : "Off")}</Badge><Button variant="outline" size="sm" onClick={() => { setEnabled((value) => !value); toast.message(t("notificationsPreview")); }}>{enabled ? t("close") : (locale === "fa" ? "فعال‌سازی نمایشی" : "Enable demo")}</Button></Card>
    <div className="mb-5 flex items-center justify-between"><div><h2 className="mb-1 text-base font-bold">{t("upcoming")}</h2><p className="mb-0 text-xs text-muted">{locale === "fa" ? "برنامهٔ زمانی پیشنهادی؛ اعلان واقعی نیست." : "Suggested schedule, not a real notification."}</p></div><Badge variant="neutral">{reminders.length - snoozed.length}</Badge></div>
    <div className="grid gap-3">{reminders.filter((item) => !snoozed.includes(item.id)).map((item, index) => <Card key={item.id} className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5"><span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-xl", index === 0 ? "bg-amber-50 dark:bg-amber-950/50" : "bg-brand-soft")}>{item.icon}</span><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="mb-0 truncate text-sm font-bold">{item.title}</h3>{index === 0 && <Badge variant="warning">{item.time}</Badge>}</div><p className="mb-0 text-[11px] text-muted">{item.list} · {item.when}</p></div><div className="flex items-center gap-2"><Button variant="secondary" size="sm" onClick={() => { setSnoozed((current) => [...current, item.id]); toast.success(locale === "fa" ? "یادآوری در پیش‌نمایش کنار گذاشته شد." : "Reminder dismissed in preview."); }}><Check className="size-3.5" /><span className="hidden sm:inline">{locale === "fa" ? "انجام شد" : "Done"}</span></Button><Button variant="ghost" size="icon" className="size-9" aria-label={t("snooze")} onClick={() => { setSnoozed((current) => [...current, item.id]); toast.message(t("snooze")); }}><Clock3 className="size-4" /></Button></div></Card>)}</div>
    {!reminders.filter((item) => !snoozed.includes(item.id)).length && <Card className="mt-3 grid min-h-48 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950"><Check className="size-5" /></span><h3 className="mb-1 text-sm font-bold">{locale === "fa" ? "همه مرتب شد" : "You’re all caught up"}</h3><p className="mb-0 text-xs text-muted">{locale === "fa" ? "یادآوری دیگری برای نمایش نیست." : "There are no more demo reminders to show."}</p><Button variant="ghost" size="sm" className="mt-3" onClick={() => setSnoozed([])}>{locale === "fa" ? "بازگردانی نمونه‌ها" : "Restore demo reminders"}</Button></div></Card>}
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" /><p className="mb-0 text-[11px] leading-5 text-muted">{t("localOnly")}</p></Card>
  </div>;
}
