"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarClock, Check, ListChecks, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
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
import type { DemoAssignee, DemoTask } from "@/lib/demo-data";

type TaskFilter = "all" | "open" | "done" | "today" | "high";
const assigneeOptions: DemoAssignee[] = ["me", "mahdi", "sara", "arman", "unassigned"];

export default function TasksPage() {
  const { t, locale } = useLocale();
  const { data, toggleTask, addTask, editTask, deleteTask, restoreTask } = useDemoData();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState<DemoTask["due"]>("today");
  const [spaceId, setSpaceId] = useState(data.spaces[0]?.id ?? "");
  const [assignee, setAssignee] = useState<DemoAssignee>("me");
  const [priority, setPriority] = useState<DemoTask["priority"]>("normal");
  const filteredTasks = useMemo(() => data.tasks.filter((task) => {
    const matchesFilter = filter === "all" || (filter === "open" && !task.done) || (filter === "done" && task.done) || (filter === "today" && task.due === "today" && !task.done) || (filter === "high" && task.priority === "high" && !task.done);
    const matchesSearch = `${task.titleFa} ${task.titleEn} ${task.assignedFa} ${task.assignedEn}`.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    return matchesFilter && matchesSearch;
  }), [data.tasks, filter, search]);
  const dueText = (value: DemoTask["due"]) => value === "today" ? t("todayLabel") : value === "tomorrow" ? t("tomorrow") : value === "week" ? t("thisWeek") : t("noDueDate");
  const assigneeLabel = (value: DemoAssignee) => ({
    me: locale === "fa" ? "خودم" : "Me", mahdi: locale === "fa" ? "مهدی" : "Mahdi", sara: locale === "fa" ? "سارا" : "Sara", arman: locale === "fa" ? "آرمان" : "Arman", unassigned: t("unassigned"),
  }[value]);
  const getAssigneeId = (task: DemoTask): DemoAssignee => {
    const value = `${task.assignedFa} ${task.assignedEn}`.toLocaleLowerCase();
    if (value.includes("سارا") || value.includes("sara")) return "sara";
    if (value.includes("آرمان") || value.includes("arman")) return "arman";
    if (value.includes("مهدی") || value.includes("mahdi")) return "mahdi";
    if (value.includes("خودم") || value.includes("me")) return "me";
    return "unassigned";
  };
  const beginCreate = () => {
    setEditingId(null); setTitle(""); setDue("today"); setSpaceId(data.spaces[0]?.id ?? ""); setAssignee("me"); setPriority("normal"); setOpen(true);
  };
  const beginEdit = (task: DemoTask) => {
    setEditingId(task.id); setTitle(locale === "fa" ? task.titleFa : task.titleEn); setDue(task.due); setSpaceId(task.spaceId); setAssignee(getAssigneeId(task)); setPriority(task.priority); setOpen(true);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !spaceId) return;
    const input = { title: title.trim(), due, spaceId, assignee, priority };
    if (editingId) { editTask(editingId, input); toast.success(t("taskUpdated")); }
    else { addTask(input.title, input.due, input.spaceId, input.assignee, input.priority); toast.success(locale === "fa" ? "کار نمونه اضافه شد." : "Sample task added."); }
    setOpen(false);
  };
  const remove = (task: DemoTask) => {
    const removed = deleteTask(task.id);
    if (removed) toast(t("taskRemoved"), { action: { label: t("restore"), onClick: () => restoreTask(removed) } });
  };
  const filters: { id: TaskFilter; label: string }[] = [
    { id: "all", label: t("all") }, { id: "open", label: t("filterOpen") }, { id: "today", label: t("dueToday") }, { id: "high", label: t("priorityHigh") }, { id: "done", label: t("filterDone") },
  ];

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("myTasks")} description={locale === "fa" ? "کارهای گروهی و شخصی‌ات را دنبال کن؛ مسئول، موعد و اولویت را مشخص کن." : "Track group and personal tasks with clear assignees, due dates and priorities."} action={<Button onClick={beginCreate}><Plus className="size-4" />{t("newTask")}</Button>} />
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3"><Card className="p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><ListChecks className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("open")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => !task.done).length}</p></div></div></Card><Card className="p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><CalendarClock className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("dueToday")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => task.due === "today" && !task.done).length}</p></div></div></Card><div className="col-span-2 lg:col-span-1"><Card className="flex h-full items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-soft text-muted"><Check className="size-5" /></span><div><p className="mb-1 text-[11px] text-muted">{t("done")}</p><p className="mb-0 text-2xl font-bold">{data.tasks.filter((task) => task.done).length}</p></div></Card></div></div>
    <Card className="mb-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"><div className="hide-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-soft/70 p-1">{filters.map((item) => <button key={item.id} onClick={() => setFilter(item.id)} className={cn("shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold transition", filter === item.id ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink")}>{item.label}</button>)}</div><div className="relative w-full sm:max-w-xs"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "fa" ? "جست‌وجوی کارها…" : "Search tasks…"} className="h-10 ps-9" /></div></Card>
    <SectionHeading title={t("taskList")} description={`${filteredTasks.length} ${t("items")}`} />
    <div className="grid gap-2.5">{filteredTasks.map((task) => { const space = data.spaces.find((item) => item.id === task.spaceId); return <Card key={task.id} className={cn("flex items-center gap-3 p-3.5 transition hover:border-brand/20 sm:gap-4 sm:p-4", task.done && "opacity-75")}><button onClick={() => toggleTask(task.id)} aria-label={t("done")} className={cn("grid size-6 shrink-0 place-items-center rounded-lg border-2 transition", task.done ? "border-brand bg-brand text-white" : "border-line text-transparent hover:border-brand")}><Check className="size-3.5 stroke-[3]" /></button><div className="min-w-0 flex-1"><p className={cn("mb-1 truncate text-sm font-semibold", task.done && "text-muted line-through")}>{locale === "fa" ? task.titleFa : task.titleEn}</p><div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted"><span>{space ? (locale === "fa" ? space.nameFa : space.nameEn) : ""}</span><span className="size-1 rounded-full bg-line" /><span>{t("assignee")}: {locale === "fa" ? task.assignedFa : task.assignedEn}</span></div></div><div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex"><Badge variant={task.done ? "success" : task.due === "today" ? "warning" : "neutral"}>{task.done ? t("done") : dueText(task.due)}</Badge>{task.priority === "high" && !task.done && <span className="text-[9px] font-semibold text-rose-600">{t("priorityHigh")}</span>}</div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" className="size-8" aria-label={t("editTask")} onClick={() => beginEdit(task)}><Pencil className="size-3.5" /></Button><Button variant="ghost" size="icon" className="size-8 text-muted hover:text-rose-600" aria-label={t("deleteTask")} onClick={() => remove(task)}><Trash2 className="size-3.5" /></Button></div></Card>; })}</div>
    {!filteredTasks.length && <Card className="mt-3 grid min-h-48 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Search className="size-5" /></span><h2 className="mb-1 text-sm font-bold">{t("noResults")}</h2><p className="mb-0 text-xs text-muted">{t("noResultsHelp")}</p></div></Card>}
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /><p className="mb-0 text-[11px] leading-5 text-muted">{t("localOnly")}</p></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editingId ? t("editTask") : t("newTask")}</DialogTitle><DialogDescription>{t("noBackend")}</DialogDescription></DialogHeader><form className="grid gap-4" onSubmit={submit}><label className="grid gap-2 text-xs font-semibold">{t("taskPlaceholder")}<Input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus maxLength={80} /></label><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold">{t("spaces")}<select value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">{data.spaces.map((space) => <option key={space.id} value={space.id}>{locale === "fa" ? space.nameFa : space.nameEn}</option>)}</select></label><label className="grid gap-2 text-xs font-semibold">{t("assignee")}<select value={assignee} onChange={(e) => setAssignee(e.target.value as DemoAssignee)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">{assigneeOptions.map((person) => <option key={person} value={person}>{assigneeLabel(person)}</option>)}</select></label><label className="grid gap-2 text-xs font-semibold">{t("dueDate")}<select value={due} onChange={(e) => setDue(e.target.value as DemoTask["due"])} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm"><option value="today">{t("todayLabel")}</option><option value="tomorrow">{t("tomorrow")}</option><option value="week">{t("thisWeek")}</option><option value="none">{t("noDueDate")}</option></select></label><label className="grid gap-2 text-xs font-semibold">{t("priority")}<select value={priority} onChange={(e) => setPriority(e.target.value as DemoTask["priority"])} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm"><option value="normal">{t("priorityNormal")}</option><option value="high">{t("priorityHigh")}</option></select></label></div><Button type="submit">{t("save")}</Button></form></DialogContent></Dialog>
  </div>;
}
