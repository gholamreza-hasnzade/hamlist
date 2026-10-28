"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Check, ClipboardList, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { listTemplates, type ListTemplate } from "@/lib/list-templates";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TemplatesPage() {
  const router = useRouter();
  const { t, locale } = useLocale();
  const { data, createListFromTemplate } = useDemoData();
  const [selected, setSelected] = useState<ListTemplate | null>(null);
  const [spaceId, setSpaceId] = useState(data.spaces[0]?.id ?? "");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => listTemplates.filter((template) => `${template.nameFa} ${template.nameEn} ${template.descriptionFa} ${template.descriptionEn}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [query]);
  const choose = (template: ListTemplate) => {
    setSelected(template);
    setSpaceId(data.spaces[0]?.id ?? "");
    setName(locale === "fa" ? template.nameFa : template.nameEn);
  };
  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !spaceId || !name.trim()) return;
    const id = createListFromTemplate({ spaceId, nameFa: name.trim(), nameEn: name.trim(), kind: selected.kind, items: selected.itemsFa.map((fa, index) => ({ fa, en: selected.itemsEn[index] })) });
    setSelected(null);
    toast.success(t("templateCreated"));
    router.push(`/app/lists/${id}`);
  };
  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("templates")} description={t("templatesSubtitle")} badge={`${listTemplates.length} ${t("templates")}`} />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-muted"><Sparkles className="size-4 text-brand" /><span>{locale === "fa" ? "الگوها نقطهٔ شروع‌اند؛ قبل یا بعد از ساخت می‌توانی موارد را ویرایش کنی." : "Templates are just a starting point; edit items before or after creating the list."}</span></div><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full sm:max-w-xs" placeholder={locale === "fa" ? "جست‌وجوی الگوها…" : "Search templates…"} /></div>
    <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map((template) => <Card key={template.id} className="flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-soft"><div className="mb-4 flex items-start justify-between gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-2xl">{template.emoji}</span><Badge variant="neutral">{template.itemsFa.length} {t("templateItems")}</Badge></div><h2 className="mb-1 text-base font-bold">{locale === "fa" ? template.nameFa : template.nameEn}</h2><p className="mb-4 min-h-10 text-xs leading-5 text-muted">{locale === "fa" ? template.descriptionFa : template.descriptionEn}</p><ul className="mb-5 grid gap-2">{(locale === "fa" ? template.itemsFa : template.itemsEn).slice(0, 4).map((item) => <li key={item} className="flex items-center gap-2 text-[11px] text-muted"><Check className="size-3.5 shrink-0 text-brand" /><span className="truncate">{item}</span></li>)}</ul><Button variant="secondary" className="mt-auto w-full" onClick={() => choose(template)}><Plus className="size-4" />{t("templateCreate")}<ArrowUpRight className="ms-auto size-4" /></Button></Card>)}</div>
    {!visible.length && <Card className="mt-4 grid min-h-44 place-items-center p-6 text-center"><div><ClipboardList className="mx-auto mb-3 size-6 text-brand" /><p className="mb-0 text-sm font-bold">{t("noResults")}</p></div></Card>}
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>{t("templateCreate")}</DialogTitle><DialogDescription>{locale === "fa" ? "یک نام و فضای مقصد انتخاب کن؛ موارد آماده هم قابل ویرایش‌اند." : "Choose a name and destination space. Starter items remain editable."}</DialogDescription></DialogHeader>{selected && <form className="grid gap-4" onSubmit={create}><label className="grid gap-2 text-xs font-semibold">{t("listName")}<Input value={name} onChange={(event) => setName(event.target.value)} required maxLength={48} autoFocus /></label><label className="grid gap-2 text-xs font-semibold">{t("chooseSpace")}<select value={spaceId} onChange={(event) => setSpaceId(event.target.value)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">{data.spaces.map((space) => <option key={space.id} value={space.id}>{locale === "fa" ? space.nameFa : space.nameEn}</option>)}</select></label><Card className="max-h-44 overflow-y-auto bg-soft/50 p-3"><p className="mb-2 text-[11px] font-bold">{t("templateItems")}</p><ul className="grid gap-2">{(locale === "fa" ? selected.itemsFa : selected.itemsEn).map((item) => <li key={item} className="flex items-center gap-2 text-[11px] text-muted"><Check className="size-3.5 text-brand" />{item}</li>)}</ul></Card><Button type="submit"><Plus className="size-4" />{t("templateCreate")}</Button></form>}</DialogContent></Dialog>
  </div>;
}
