"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarClock, Check, CirclePlus, ListTodo, MoreHorizontal, Plus, Sparkles, Users, WandSparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { SectionHeading } from "@/components/hamlist/section-heading";
import { StatCard } from "@/components/hamlist/stat-card";
import { SpaceCard } from "@/components/hamlist/space-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { t, locale, dir } = useLocale();
  const { data, toggleTask } = useDemoData();
  const openCount = data.lists.reduce((sum, list) => sum + list.items.filter((item) => !item.done).length, 0);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const todayTasks = data.tasks.filter((task) => !task.done).slice(0, 3);
  const getSpace = (id: string) => data.spaces.find((space) => space.id === id);

  return <div className="page-enter">
    <section className="welcome-panel relative mb-7 overflow-hidden rounded-[28px] border border-[#e9e3f5] bg-gradient-to-br from-[#f2effb] via-white to-[#fbfaff] px-5 py-6 shadow-soft dark:border-[#39364d] dark:from-[#202136] dark:via-[#202432] dark:to-[#282540] sm:px-8 sm:py-8 lg:min-h-[278px] lg:px-10">
      <div className="pointer-events-none absolute -end-12 -top-24 size-72 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/15" /><div className="pointer-events-none absolute bottom-[-140px] start-[38%] size-72 rounded-full border border-brand/10 shadow-[0_0_0_35px_rgba(105,85,184,.025),0_0_0_70px_rgba(105,85,184,.02)]" />
      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.86fr)]">
        <div className="max-w-xl"><Badge variant="default" className="mb-4 border-0"><Sparkles className="size-3" />{t("subtitle")}</Badge><h1 className="mb-3 text-balance text-[32px] font-bold leading-[1.23] tracking-tight text-ink sm:text-[42px]">{t("welcome")}</h1><p className="mb-6 max-w-lg text-sm leading-7 text-muted sm:text-[15px]">{t("welcomeSub")}</p><div className="flex flex-wrap items-center gap-3"><Button size="lg" className="rounded-2xl" onClick={() => window.dispatchEvent(new Event("hamlist:new-list"))}><Plus className="size-4" />{t("createFirstList")}</Button><Link href="/app/spaces" className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-muted transition hover:bg-white/70 hover:text-brand dark:hover:bg-white/5"><Users className="size-4" />{t("forEveryGroup")}</Link></div></div>
        <div className="relative mx-auto hidden min-h-[210px] w-full max-w-[380px] place-items-center lg:grid" aria-hidden="true"><div className="absolute size-56 rounded-full border border-brand/20" /><div className="absolute size-72 rounded-full border border-dashed border-brand/15" /><div className="absolute h-40 w-72 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-500/15" />
          <div className="animate-[float_5s_ease-in-out_infinite] relative w-[290px] rotate-[-2deg] rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-[0_24px_60px_rgba(52,42,92,.2)] dark:border-white/10 dark:bg-[#25283a]">
            <div className="mb-3 flex items-center gap-3 border-b border-line pb-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-lg">🛒</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs">{locale === "fa" ? "خرید این هفته" : "This week’s groceries"}</strong><small className="text-[10px] text-muted">{locale === "fa" ? "خانه · ۳ عضو" : "Home · 3 members"}</small></div><MoreHorizontal className="size-4 text-muted" /></div>
            {(locale === "fa" ? ["نان و شیر", "قهوه", "میوهٔ فصل"] : ["Bread and milk", "Coffee", "Seasonal fruit"]).map((label, i) => <div key={label} className="flex items-center gap-2.5 py-2"><span className={cn("grid size-[17px] place-items-center rounded-[6px] border", i === 2 ? "border-brand bg-brand text-white" : "border-line text-transparent")}><Check className="size-3" /></span><span className={cn("text-[11px]", i === 2 ? "text-muted line-through" : "text-ink")}>{label}</span><span className="ms-auto text-[9px] text-muted">{i === 2 ? "✓" : ""}</span></div>)}
            <div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand/70 to-brand" /></div><small className="text-[9px] text-muted">2/3</small></div>
          </div><div className="absolute end-0 top-4 rounded-xl border border-line bg-surface px-3 py-2 text-[10px] font-semibold text-brand shadow-soft"><WandSparkles className="me-1 inline size-3.5" />{locale === "fa" ? "باهم، ساده‌تر" : "Better together"}</div><div className="absolute bottom-2 start-0 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-soft"><span className="grid size-7 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-200">س</span><span className="text-[10px] font-semibold">{locale === "fa" ? "سارا یک مورد اضافه کرد" : "Sara added an item"}</span></div>
        </div>
      </div>
    </section>

    <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
      <StatCard label={t("openItems")} value={openCount} note={locale === "fa" ? "در فهرست‌های مشترک" : "Across shared lists"} icon={ListTodo} />
      <StatCard label={t("dueToday")} value={data.tasks.filter((task) => task.due === "today" && !task.done).length} note={locale === "fa" ? "۱ مورد نزدیک موعد" : "One approaching deadline"} icon={CalendarClock} tone="blue" />
      <div className="col-span-2 lg:col-span-1"><StatCard label={t("collaborators")} value={data.spaces.reduce((sum, space) => sum + space.memberCount, 0)} note={t("acrossLists")} icon={Users} tone="slate" /></div>
    </section>

    <section className="mb-8"><SectionHeading title={t("recentSpaces")} description={locale === "fa" ? "گروه‌هایی که اخیراً در آن‌ها فعالیت داشتی." : "Groups you’ve been working in lately."} action={<Link href="/app/spaces" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">{t("seeAll")} <Arrow className="size-4" /></Link>} /><div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.spaces.slice(0, 3).map((space) => <SpaceCard key={space.id} space={space} lists={data.lists} />)}<Link href="/app/spaces" className="group flex min-h-[208px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6cdea] bg-white/50 px-5 text-center transition hover:border-brand/50 hover:bg-brand-soft/40 dark:border-[#514a70] dark:bg-white/[.02]"><span className="mb-3 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand transition group-hover:rotate-90"><CirclePlus className="size-6" /></span><strong className="text-sm">{t("newSpace")}</strong><span className="mt-1 text-[11px] text-muted">{locale === "fa" ? "برای هر کاری که باهم انجام می‌دهید" : "For anything you do together"}</span></Link></div></section>

    <section><SectionHeading title={t("today")} action={<Badge variant="neutral">{t("sampleData")}</Badge>} /><div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]"><Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 className="mb-0 text-sm font-bold">{t("waitingForYou")}</h2><Link href="/app/tasks" className="text-[11px] font-semibold text-brand hover:underline">{t("seeAll")}</Link></div><div className="grid gap-2.5">{todayTasks.map((task) => { const space = getSpace(task.spaceId); return <div key={task.id} className="flex items-center gap-3 rounded-xl border border-line/80 p-3 transition hover:bg-surface-soft"><button onClick={() => toggleTask(task.id)} className={cn("grid size-5 place-items-center rounded-md border transition", task.done ? "border-brand bg-brand text-white" : "border-line text-transparent hover:border-brand")} aria-label={t("done")}><Check className="size-3" /></button><div className="min-w-0 flex-1"><p className={cn("mb-0 truncate text-xs font-semibold", task.done && "text-muted line-through")}>{locale === "fa" ? task.titleFa : task.titleEn}</p><p className="mb-0 mt-1 truncate text-[10px] text-muted">{space ? (locale === "fa" ? space.nameFa : space.nameEn) : ""} · {locale === "fa" ? task.assignedFa : task.assignedEn}</p></div><Badge variant={task.due === "today" ? "warning" : "neutral"}>{task.due === "today" ? t("todayLabel") : task.due === "tomorrow" ? t("tomorrow") : t("open")}</Badge></div>; })}</div></Card>
      <Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 className="mb-0 text-sm font-bold">{t("recentActivity")}</h2><Badge variant="neutral">{t("comingSoon")}</Badge></div><div className="grid gap-5">{[
        { icon: "✓", titleFa: "سارا «میوهٔ فصل» را اضافه کرد", titleEn: "Sara added seasonal fruit", subFa: "در خرید این هفته · ۱۲ دقیقه پیش", subEn: "In this week’s groceries · 12 min ago" },
        { icon: "+", titleFa: "مهدی یک فهرست ساخت", titleEn: "Mahdi created a list", subFa: "کارهای این هفته · دیروز", subEn: "This week’s tasks · Yesterday" },
        { icon: "↗", titleFa: "آرمان به فضای سفر پیوست", titleEn: "Arman joined the trip space", subFa: "سفر آخر هفته · دیروز", subEn: "Weekend trip · Yesterday" },
      ].map((event) => <div key={event.titleEn} className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand">{event.icon}</span><div><p className="mb-1 text-xs font-medium leading-5">{locale === "fa" ? event.titleFa : event.titleEn}</p><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? event.subFa : event.subEn}</p></div></div>)}</div></Card></div></section>
  </div>;
}
