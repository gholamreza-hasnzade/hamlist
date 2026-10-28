"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarClock, Check, ListChecks, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { SectionHeading } from "@/components/hamlist/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DemoTask } from "@/lib/demo-data";

export default function TasksPage() {
  const { t, locale } = useLocale();
  const { data, toggleTask, addTask } = useDemoData();
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState<DemoTask["due"]>("today");
  const [spaceId, setSpaceId] = useState(data.spaces[0]?.id ?? "");
  const tasks = useMemo(() => data.tasks.filter((task) => (filter === "all" || (filter === "done" ? task.done : !task.done)) && `${task.titleFa} ${task.titleEn}`.toLowerCase().includes(search.toLowerCase())), [data.tasks, filter, search]);
  const dueText = (value: DemoTask["due"]) => value === "today" ? t("todayLabel") : value === "tomorrow" ? t("tomorrow") : value === "week" ? t("thisWeek") : t("noDueDate");
  const dueTone = (value: DemoTask["due"]) => value === "today" ? "warning" as const : "neutral" as const;
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim() || !spaceId) return; addTask(title.trim(), due, spaceId); toast.success(locale === "fa" ? "کار نمونه اضافه شد." : "Sample task added."); setTitle(""); setOpen(false); };

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("myTasks")} description={locale === "fa" ? "کارهای گروهی و شخصی‌ات را دنبال کن؛ روشن و بدون پیچیدگی." : "Keep shared and personal tasks clear and easy to follow."} action={<Button onClick={() => setOpen(true)}><Plus className="size-4" />{t("newTask")}</Button>} />
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3"><Card className="p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><ListChecks className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("open")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => !task.done).length}</p></div></div></Card><Card className="p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><CalendarClock className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("dueToday")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => task.due === "today" && !task.done).length}</p></div></div></Card><div className="col-span-2 lg:col-span-1"><Card className="flex h-full items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-soft text-muted"><Check className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("done")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => task.done).length}</p></div></Card></div></div>
    <Card className="mb-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"><div className="flex items-center gap-1 rounded-xl bg-soft/70 p-1">{(["all", "open", "done"] as const).map((value) => { const label = value === "all" ? t("all") : value === "open" ? t("filterOpen") : t("filterDone"); return <button key={value} onClick={() => setFilter(value)} className={cn("rounded-lg px-3 py-2 text-[11px] font-semibold transition", filter === value ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink")}>{label}</button>; })}</div><div className="relative w-full sm:max-w-xs"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "fa" ? "جست‌وجوی کارها…" : "Search tasks…"} className="h-10 ps-9" /></div></Card>
    <SectionHeading title={t("taskList")} description={`${tasks.length} ${t("items")}`} />
    <div className="grid gap-2.5">{tasks.map((task) => { const space = data.spaces.find((item) => item.id === task.spaceId); return <Card key={task.id} className={cn("flex items-center gap-3 p-3.5 transition hover:border-brand/20 sm:gap-4 sm:p-4", task.done && "opacity-75")}><button onClick={() => toggleTask(task.id)} aria-label={t("done")} className={cn("grid size-6 shrink-0 place-items-center rounded-lg border-2 transition", task.done ? "border-brand bg-brand text-white" : "border-line text-transparent hover:border-brand")}><Check className="size-3.5 stroke-[3]" /></button><div className="min-w-0 flex-1"><p className={cn("mb-1 truncate text-sm font-semibold", task.done && "text-muted line-through")}>{locale === "fa" ? task.titleFa : task.titleEn}</p><div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted"><span>{space ? (locale === "fa" ? space.nameFa : space.nameEn) : ""}</span><span className="size-1 rounded-full bg-line" /><span>{t("assignedTo")}: {locale === "fa" ? task.assignedFa : task.assignedEn}</span></div></div><div className="flex shrink-0 flex-col items-end gap-1.5"><Badge variant={task.done ? "success" : dueTone(task.due)}>{task.done ? t("done") : dueText(task.due)}</Badge>{task.priority === "high" && !task.done && <span className="text-[9px] font-semibold text-rose-600">{locale === "fa" ? "اولویت بالا" : "High priority"}</span>}</div></Card>; })}</div>
    {!tasks.length && <Card className="mt-3 grid min-h-48 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Search className="size-5" /></span><h2 className="mb-1 text-sm font-bold">{t("noResults")}</h2><p className="mb-0 text-xs text-muted">{t("noResultsHelp")}</p></div></Card>}
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /><p className="mb-0 text-[11px] leading-5 text-muted">{t("localOnly")}</p></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{t("newTask")}</DialogTitle><DialogDescription>{t("noBackend")}</DialogDescription></DialogHeader><form className="grid gap-4" onSubmit={submit}><label className="grid gap-2 text-xs font-semibold">{t("taskPlaceholder")}<Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus maxLength={80} /></label><label className="grid gap-2 text-xs font-semibold">{t("spaces")}<select value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">{data.spaces.map((space) => <option key={space.id} value={space.id}>{locale === "fa" ? space.nameFa : space.nameEn}</option>)}</select></label><label className="grid gap-2 text-xs font-semibold">{t("dueDate")}<select value={due} onChange={(e) => setDue(e.target.value as DemoTask["due"])} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm"><option value="today">{t("todayLabel")}</option><option value="tomorrow">{t("tomorrow")}</option><option value="week">{t("thisWeek")}</option><option value="none">{t("noDueDate")}</option></select></label><Button type="submit">{t("create")}</Button></form></DialogContent></Dialog>
  </div>;
}
