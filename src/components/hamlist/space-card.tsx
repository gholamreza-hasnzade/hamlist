import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, Check, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/providers/locale-provider";
import type { DemoList, DemoSpace } from "@/lib/demo-data";

export function SpaceCard({ space, lists }: { space: DemoSpace; lists: DemoList[] }) {
  const { locale, t, dir } = useLocale();
  const own = lists.filter((list) => list.spaceId === space.id);
  const total = own.reduce((sum, list) => sum + list.items.length, 0);
  const done = own.reduce((sum, list) => sum + list.items.filter((item) => item.done).length, 0);
  const percent = total ? Math.round(done / total * 100) : 0;
  const Arrow = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;
  return <Link href={`/app/spaces/${space.id}`} className="group block h-full"><Card className="space-card relative h-full overflow-hidden p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-brand/25 group-hover:shadow-lift"><span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand/35 via-brand/70 to-violet-200 dark:to-slate-500" /><div className="mb-5 flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-2xl">{space.emoji}</span><div className="flex -space-x-2 rtl:space-x-reverse">{["M","S","A"].slice(0, Math.min(space.memberCount, 3)).map((letter, i) => <span key={letter} className={`grid size-8 place-items-center rounded-full border-2 border-surface text-[10px] font-bold ${i === 0 ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>{locale === "fa" ? ["م","س","آ"][i] : letter}</span>)}</div></div><div className="mb-1 flex items-center justify-between"><h3 className="mb-0 text-base font-bold text-ink">{locale === "fa" ? space.nameFa : space.nameEn}</h3><Arrow className="size-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" /></div><p className="mb-4 text-xs leading-6 text-muted">{locale === "fa" ? space.descriptionFa : space.descriptionEn}</p><div className="mb-3 flex items-center gap-3 text-[10px] text-muted"><span className="inline-flex items-center gap-1"><Users className="size-3.5" />{space.memberCount} {t("members")}</span><span className="size-1 rounded-full bg-line" /><span>{own.length} {t("lists")}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-gradient-to-r from-[#9a88d0] to-brand transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-2 flex justify-between text-[10px] text-muted"><span className="inline-flex items-center gap-1"><Check className="size-3" />{done}/{total} {t("done")}</span><Badge variant="neutral" className="border-0 px-2 py-1">{t("privateSpace")}</Badge></div></Card></Link>;
}
