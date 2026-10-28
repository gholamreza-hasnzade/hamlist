"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronLeft, CirclePlus, ClipboardList, ListPlus, Plus, Share2, Users } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { SectionHeading } from "@/components/hamlist/section-heading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/hamlist/stat-card";
import { InviteDialog } from "@/components/hamlist/invite-dialog";

export default function SpaceDetailPage() {
  const params = useParams<{ spaceId: string }>();
  const router = useRouter();
  const { t, locale } = useLocale();
  const { data } = useDemoData();
  const [inviteOpen, setInviteOpen] = useState(false);
  const space = data.spaces.find((item) => item.id === params.spaceId);
  const lists = useMemo(() => data.lists.filter((list) => list.spaceId === params.spaceId), [data.lists, params.spaceId]);
  if (!space) return <div className="page-enter"><PageHeader title={t("noResults")} description={t("noResultsHelp")} /><Button variant="secondary" onClick={() => router.push("/app/spaces")}>{t("backHome")}</Button></div>;
  const total = lists.reduce((sum, list) => sum + list.items.length, 0);
  const done = lists.reduce((sum, list) => sum + list.items.filter((item) => item.done).length, 0);
  const members = locale === "fa" ? [{ name: "مهدی", role: t("owner"), initials: "م" }, { name: "سارا", role: t("member"), initials: "س" }, { name: "آرمان", role: t("member"), initials: "آ" }] : [{ name: "Mahdi", role: t("owner"), initials: "M" }, { name: "Sara", role: t("member"), initials: "S" }, { name: "Arman", role: t("member"), initials: "A" }];

  return <div className="page-enter">
    <div className="mb-5 flex items-center gap-2 text-[11px] text-muted"><Link href="/app/spaces" className="hover:text-brand">{t("spaces")}</Link><ChevronLeft className="size-3" /><span>{locale === "fa" ? space.nameFa : space.nameEn}</span></div>
    <PageHeader eyebrow={t("privateSpace")} title={`${space.emoji} ${locale === "fa" ? space.nameFa : space.nameEn}`} description={locale === "fa" ? space.descriptionFa : space.descriptionEn} action={<div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setInviteOpen(true)}><Share2 className="size-4" />{t("invite")}</Button><Button onClick={() => window.dispatchEvent(new Event("hamlist:new-list"))}><Plus className="size-4" />{t("newList")}</Button></div>} />
    <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-3"><StatCard label={t("listCount")} value={lists.length} note={t("workspace")} icon={ClipboardList} /><StatCard label={t("members")} value={space.memberCount} note={t("privateSpace")} icon={Users} tone="blue" /><div className="col-span-2 lg:col-span-1"><StatCard label={t("done")} value={`${done}/${total}`} note={locale === "fa" ? "پیشرفت فهرست‌ها" : "Across all lists"} icon={Check} tone="slate" /></div></div>
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section><SectionHeading title={t("lists")} description={locale === "fa" ? "همهٔ مواردی که این گروه باهم دنبال می‌کند." : "Everything this group is keeping track of."} action={<Button variant="ghost" size="sm" onClick={() => window.dispatchEvent(new Event("hamlist:new-list"))}><ListPlus className="size-4" />{t("createNew")}</Button>} />
        {lists.length ? <div className="grid gap-3">{lists.map((list) => { const count = list.items.length; const completed = list.items.filter((item) => item.done).length; return <Link key={list.id} href={`/app/lists/${list.id}`} className="group"><Card className="flex items-center gap-4 p-4 transition group-hover:-translate-y-0.5 group-hover:border-brand/25 group-hover:shadow-soft sm:p-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-2xl">{list.emoji}</span><div className="min-w-0 flex-1"><h3 className="mb-1 truncate text-sm font-bold">{locale === "fa" ? list.nameFa : list.nameEn}</h3><p className="mb-0 text-[11px] text-muted">{completed}/{count} {t("done")} · {t("updatedToday")}</p><div className="mt-3 h-1.5 max-w-[350px] overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-brand" style={{ width: count ? `${completed/count*100}%` : "0%" }} /></div></div><div className="hidden items-center gap-1.5 sm:flex"><Badge variant="neutral">{count} {t("open")}</Badge><span className="grid size-8 place-items-center rounded-xl text-muted transition group-hover:bg-brand-soft group-hover:text-brand"><ArrowRight className="size-4" /></span></div></Card></Link>; })}</div> : <Card className="grid min-h-56 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-soft text-brand"><CirclePlus className="size-5" /></span><h3 className="mb-2 text-sm font-bold">{t("emptyItems")}</h3><p className="mb-4 max-w-xs text-xs leading-6 text-muted">{t("emptyItemsHelp")}</p><Button onClick={() => window.dispatchEvent(new Event("hamlist:new-list"))}><Plus className="size-4" />{t("newList")}</Button></div></Card>}
      </section>
      <aside className="grid content-start gap-5"><Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="mb-1 text-sm font-bold">{t("memberList")}</h2><p className="mb-0 text-[10px] text-muted">{space.memberCount} {t("members")}</p></div><Button variant="ghost" size="icon" className="size-8" onClick={() => setInviteOpen(true)} aria-label={t("invite")}><Plus className="size-4" /></Button></div><div className="grid gap-3">{members.slice(0, space.memberCount).map((member, index) => <div key={member.name} className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${index === 0 ? "bg-brand-soft text-brand" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"}`}>{member.initials}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{member.name}</span><span className="text-[10px] text-muted">{member.role}</span></div>)}</div><Button variant="secondary" className="mt-4 w-full" size="sm" onClick={() => setInviteOpen(true)}><Users className="size-4" />{t("invite")}</Button></Card>
        <Card className="border-brand/15 bg-brand-soft/35 p-5"><Badge variant="default" className="mb-3 border-0">{t("demo")}</Badge><h3 className="mb-2 text-sm font-bold">{locale === "fa" ? "همکاری بدون شلوغی" : "Keep teamwork simple"}</h3><p className="mb-0 text-xs leading-6 text-muted">{t("localOnly")}</p></Card>
      </aside>
    </div>
    <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} space={space} />
  </div>;
}
