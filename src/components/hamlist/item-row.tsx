"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";
import type { DemoItem } from "@/lib/demo-data";

export function ItemRow({ item, onToggle, onEdit, onDelete, onMoveUp, onMoveDown }: { item: DemoItem; onToggle: () => void; onEdit: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void }) {
  const { locale, t } = useLocale();
  const [menu, setMenu] = useState(false);
  const title = locale === "fa" ? item.titleFa : item.titleEn;
  const note = locale === "fa" ? item.noteFa : item.noteEn;
  const run = (action: () => void) => { action(); setMenu(false); };
  return <div className={cn("group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition hover:border-brand/20 hover:shadow-sm sm:p-4", item.done && "bg-soft/35")}>
    <button type="button" onClick={onToggle} aria-label={item.done ? t("open") : t("done")} className={cn("grid size-6 shrink-0 place-items-center rounded-[8px] border-2 transition", item.done ? "border-brand bg-brand text-white" : "border-line bg-surface text-transparent hover:border-brand hover:text-brand")}><Check className="size-3.5 stroke-[3]" /></button>
    <div className="min-w-0 flex-1"><div className={cn("truncate text-sm font-semibold text-ink", item.done && "text-muted line-through")}>{title}</div>{(note || item.quantity) && <div className="mt-1 truncate text-[11px] text-muted">{item.quantity}{item.quantity && note ? " · " : ""}{note}</div>}</div>
    <span className={cn("hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex", item.done ? "bg-soft text-muted" : "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200")}>{item.done ? t("done") : t("open")}</span>
    <div className="relative"><Button variant="ghost" size="icon" className="size-8 text-muted opacity-100 sm:opacity-0 sm:group-hover:opacity-100" aria-label={t("details")} aria-expanded={menu} onClick={() => setMenu((value) => !value)}><MoreHorizontal className="size-4" /></Button>{menu && <div className="absolute end-0 top-9 z-20 w-44 rounded-xl border border-line bg-surface p-1.5 shadow-xl">
      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-xs text-ink hover:bg-soft" onClick={() => run(onEdit)}><Pencil className="size-3.5 text-muted" />{t("editItem")}</button>
      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-xs text-ink hover:bg-soft" onClick={() => run(onMoveUp)}><ArrowUp className="size-3.5 text-muted" />{t("moveUp")}</button>
      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-xs text-ink hover:bg-soft" onClick={() => run(onMoveDown)}><ArrowDown className="size-3.5 text-muted" />{t("moveDown")}</button>
      <div className="my-1 border-t border-line" />
      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => run(onDelete)}><Trash2 className="size-3.5" />{t("delete")}</button>
    </div>}</div>
  </div>;
}
