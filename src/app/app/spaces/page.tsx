"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownUp, ClipboardList, Plus, Search, UserRoundPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { SpaceCard } from "@/components/hamlist/space-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SpacesPage() {
  const { t, locale } = useLocale();
  const { data, createSpace } = useDemoData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => data.spaces.filter((space) => `${space.nameFa} ${space.nameEn} ${space.descriptionFa} ${space.descriptionEn}`.toLowerCase().includes(search.toLowerCase())), [data.spaces, search]);
  useEffect(() => { const value = new URLSearchParams(window.location.search).get("search"); if (value) setSearch(value); }, []);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!name.trim()) return; const id = createSpace(name.trim()); setOpen(false); setName(""); toast.success(locale === "fa" ? "فضای نمونه ساخته شد." : "Sample space created."); router.push(`/app/spaces/${id}`); };

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("spaces")} description={locale === "fa" ? "فضاهای شخصی و گروهی‌ات را یک‌جا مدیریت کن." : "Keep your personal and shared spaces together."} action={<div className="flex gap-2"><Button variant="secondary" onClick={() => router.push("/app/templates")}><ClipboardList className="size-4" />{t("browseTemplates")}</Button><Button onClick={() => setOpen(true)}><Plus className="size-4" />{t("newSpace")}</Button></div>} />
    <Card className="mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><Users className="size-5" /></span><div><p className="mb-1 text-sm font-bold">{data.spaces.length} {t("spaces")}</p><p className="mb-0 text-[11px] text-muted">{locale === "fa" ? "هر فضا، اعضا و فهرست‌های خودش را دارد." : "Each space keeps its own members and lists."}</p></div></div><div className="flex flex-wrap gap-2"><div className="relative min-w-[190px] flex-1 sm:flex-none"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} className="h-10 ps-9 sm:w-64" /></div><Button variant="secondary" onClick={() => toast.message(t("noBackend"))}><UserRoundPlus className="size-4" />{locale === "fa" ? "پیوستن با لینک" : "Join with link"}</Button><Button variant="ghost" size="icon" aria-label={locale === "fa" ? "مرتب‌سازی" : "Sort spaces"}><ArrowDownUp className="size-4" /></Button></div></Card>
    {filtered.length ? <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((space) => <SpaceCard key={space.id} space={space} lists={data.lists} />)}</div> : <Card className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-soft text-brand"><Search className="size-5" /></span><h2 className="mb-2 text-base font-bold">{t("noResults")}</h2><p className="mb-4 max-w-sm text-sm leading-6 text-muted">{t("noResultsHelp")}</p><Button variant="secondary" onClick={() => { setSearch(""); setOpen(true); }}><Plus className="size-4" />{t("newSpace")}</Button></div></Card>}
    <Card className="mt-7 flex items-center gap-4 border-dashed bg-surface/60 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft text-brand"><span className="text-lg">✦</span></span><div className="min-w-0 flex-1"><p className="mb-1 text-xs font-bold">{locale === "fa" ? "یک فضا برای هر جور همکاری" : "A space for every kind of group"}</p><p className="mb-0 text-[11px] leading-5 text-muted">{locale === "fa" ? "خانه، سفر، دوستان یا یک پروژهٔ کوچک—نام و قالب فضا دست خودت است." : "Home, a trip, friends or a small project — choose a name and make it yours."}</p></div><Badge variant="neutral" className="hidden sm:inline-flex">{t("demo")}</Badge></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{t("createSpace")}</DialogTitle><DialogDescription>{t("createSpaceHelp")}</DialogDescription></DialogHeader><form onSubmit={submit} className="grid gap-4"><label className="grid gap-2 text-xs font-semibold">{t("spaceName")}<Input value={name} onChange={(e) => setName(e.target.value)} maxLength={48} required autoFocus placeholder={t("spaceNamePlaceholder")} /></label><div className="rounded-xl bg-soft/60 p-3 text-[11px] leading-5 text-muted">{t("localOnly")}</div><Button type="submit">{t("create")}</Button></form></DialogContent></Dialog>
  </div>;
}
