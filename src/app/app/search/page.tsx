"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid2X2, ListChecks, ListTodo, ArrowUpLeft, ArrowUpRight, CircleHelp, ReceiptText } from "lucide-react";

export default function SearchPage() {
  const { t, locale, dir } = useLocale();
  const { data } = useDemoData();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, []);
  const normalized = query.trim().toLocaleLowerCase();
  const results = useMemo(() => {
    if (!normalized) return { spaces: [], lists: [], items: [], tasks: [], expenses: [] };
    const includes = (...values: Array<string | undefined>) => values.some((value) => value?.toLocaleLowerCase().includes(normalized));
    return {
      spaces: data.spaces.filter((space) => includes(space.nameFa, space.nameEn, space.descriptionFa, space.descriptionEn)),
      lists: data.lists.filter((list) => includes(list.nameFa, list.nameEn)),
      items: data.lists.flatMap((list) => list.items.filter((item) => includes(item.titleFa, item.titleEn, item.noteFa, item.noteEn)).map((item) => ({ item, list }))),
      tasks: data.tasks.filter((task) => includes(task.titleFa, task.titleEn, task.assignedFa, task.assignedEn)),
      expenses: data.expenses.filter((expense) => includes(expense.titleFa, expense.titleEn, expense.paidByFa, expense.paidByEn)),
    };
  }, [data, normalized]);
  const count = results.spaces.length + results.lists.length + results.items.length + results.tasks.length + results.expenses.length;
  const Arrow = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;
  const ResultRow = ({ href, icon, label, subtitle, badge }: { href: string; icon: React.ReactNode; label: string; subtitle: string; badge?: string }) => <Link href={href} className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition hover:border-brand/25 hover:bg-surface-soft sm:p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">{icon}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{label}</span><span className="mt-1 block truncate text-[10px] text-muted">{subtitle}</span></span>{badge && <Badge variant="neutral" className="hidden sm:inline-flex">{badge}</Badge>}<Arrow className="size-4 shrink-0 text-muted transition group-hover:text-brand" /></Link>;

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("searchTitle")} description={locale === "fa" ? "در فضاها، فهرست‌ها، موردها و کارها جست‌وجو کن." : "Search spaces, lists, items and tasks in this browser preview."} />
    <Card className="mb-6 p-3 sm:p-4"><div className="relative"><Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-brand" /><Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} className="h-12 border-transparent bg-soft/65 ps-10 shadow-none focus-visible:bg-surface" /></div><div className="mt-2 flex items-center justify-between px-1"><span className="text-[10px] text-muted">{locale === "fa" ? "میان‌بر صفحه‌کلید: Ctrl/⌘ + K" : "Keyboard shortcut: Ctrl/⌘ + K"}</span>{normalized && <Badge variant="neutral">{count} {t("searchResults")}</Badge>}</div></Card>
    {!normalized ? <Card className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><Search className="size-5" /></span><h2 className="mb-2 text-base font-bold">{t("searchTitle")}</h2><p className="mb-0 max-w-sm text-xs leading-6 text-muted">{locale === "fa" ? "نام یک فضا، فهرست، مورد یا کار را بنویس تا نتیجه‌ها همین‌جا نمایش داده شوند." : "Type a space, list, item or task name to see matching results here."}</p></div></Card> : count ? <div className="grid gap-6">
      {!!results.spaces.length && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><Grid2X2 className="size-4 text-brand" />{t("searchSpaces")} <Badge variant="neutral">{results.spaces.length}</Badge></h2><div className="grid gap-2">{results.spaces.map((space) => <ResultRow key={space.id} href={`/app/spaces/${space.id}`} icon={<span className="text-lg">{space.emoji}</span>} label={locale === "fa" ? space.nameFa : space.nameEn} subtitle={locale === "fa" ? space.descriptionFa : space.descriptionEn} badge={`${space.memberCount} ${t("members")}`} />)}</div></section>}
      {!!results.lists.length && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><ListChecks className="size-4 text-brand" />{t("searchLists")} <Badge variant="neutral">{results.lists.length}</Badge></h2><div className="grid gap-2">{results.lists.map((list) => <ResultRow key={list.id} href={`/app/lists/${list.id}`} icon={<span className="text-lg">{list.emoji}</span>} label={locale === "fa" ? list.nameFa : list.nameEn} subtitle={data.spaces.find((space) => space.id === list.spaceId)?.[locale === "fa" ? "nameFa" : "nameEn"] ?? ""} badge={`${list.items.length} ${t("items")}`} />)}</div></section>}
      {!!results.items.length && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><Search className="size-4 text-brand" />{t("searchItems")} <Badge variant="neutral">{results.items.length}</Badge></h2><div className="grid gap-2">{results.items.map(({ item, list }) => <ResultRow key={`${list.id}-${item.id}`} href={`/app/lists/${list.id}`} icon={<span className="text-lg">{item.done ? "✓" : "•"}</span>} label={locale === "fa" ? item.titleFa : item.titleEn} subtitle={locale === "fa" ? list.nameFa : list.nameEn} badge={item.done ? t("done") : t("open")} />)}</div></section>}
      {!!results.tasks.length && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><ListTodo className="size-4 text-brand" />{t("searchTasks")} <Badge variant="neutral">{results.tasks.length}</Badge></h2><div className="grid gap-2">{results.tasks.map((task) => <ResultRow key={task.id} href="/app/tasks" icon={<ListTodo className="size-4" />} label={locale === "fa" ? task.titleFa : task.titleEn} subtitle={`${data.spaces.find((space) => space.id === task.spaceId)?.[locale === "fa" ? "nameFa" : "nameEn"] ?? ""} · ${locale === "fa" ? task.assignedFa : task.assignedEn}`} badge={task.done ? t("done") : task.due === "today" ? t("todayLabel") : t("open")} />)}</div></section>}
      {!!results.expenses.length && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><ReceiptText className="size-4 text-brand" />{t("searchExpenses")} <Badge variant="neutral">{results.expenses.length}</Badge></h2><div className="grid gap-2">{results.expenses.map((expense) => <ResultRow key={expense.id} href="/app/expenses" icon={<ReceiptText className="size-4" />} label={locale === "fa" ? expense.titleFa : expense.titleEn} subtitle={`${locale === "fa" ? expense.paidByFa : expense.paidByEn} · ${expense.amount} ${expense.currency}`} badge={expense.settled ? t("expenseSettled") : t("expenseOpen")} />)}</div></section>}
    </div> : <Card className="grid min-h-56 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-soft text-muted"><CircleHelp className="size-5" /></span><h2 className="mb-1 text-sm font-bold">{t("noSearchResults")}</h2><p className="mb-0 text-xs text-muted">{t("noResultsHelp")}</p><Button variant="ghost" size="sm" className="mt-3" onClick={() => setQuery("")}>{t("close")}</Button></div></Card>}
  </div>;
}
