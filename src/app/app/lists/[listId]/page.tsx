"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronLeft, CirclePlus, MoreHorizontal, Plus, Share2, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { ItemRow } from "@/components/hamlist/item-row";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InviteDialog } from "@/components/hamlist/invite-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DemoItem } from "@/lib/demo-data";

export default function ListDetailPage() {
  const params = useParams<{ listId: string }>();
  const router = useRouter();
  const { t, locale } = useLocale();
  const { data, addItem, editItem, moveItem, toggleItem, removeItem, restoreItem, renameList, deleteList, restoreList } = useDemoData();
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [editingItem, setEditingItem] = useState<DemoItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const list = data.lists.find((item) => item.id === params.listId);
  const space = list ? data.spaces.find((item) => item.id === list.spaceId) : undefined;
  const visibleItems = useMemo(() => list?.items.filter((item) => filter === "all" || (filter === "done" ? item.done : !item.done)) ?? [], [list, filter]);
  if (!list) return <div className="page-enter"><PageHeader title={t("noResults")} description={t("noResultsHelp")} /><Button variant="secondary" onClick={() => router.push("/app/spaces")}>{t("backHome")}</Button></div>;
  const total = list.items.length;
  const done = list.items.filter((item) => item.done).length;
  const listName = locale === "fa" ? list.nameFa : list.nameEn;
  const spaceName = space ? locale === "fa" ? space.nameFa : space.nameEn : t("spaces");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    addItem(list.id, value, note.trim() || undefined, quantity.trim() || undefined);
    setTitle(""); setNote(""); setQuantity("");
    toast.success(locale === "fa" ? "مورد به فهرست اضافه شد." : "Item added to the list.");
  };
  const deleteItem = (itemId: string) => {
    const removed = removeItem(list.id, itemId);
    if (removed) toast(t("removed"), { action: { label: t("restore"), onClick: () => restoreItem(list.id, removed) } });
  };
  const openItemEditor = (item: DemoItem) => {
    setEditingItem(item);
    setEditTitle(locale === "fa" ? item.titleFa : item.titleEn);
    setEditNote(locale === "fa" ? item.noteFa ?? "" : item.noteEn ?? "");
    setEditQuantity(item.quantity ?? "");
  };
  const saveItemEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingItem || !editTitle.trim()) return;
    editItem(list.id, editingItem.id, { title: editTitle.trim(), note: editNote.trim() || undefined, quantity: editQuantity.trim() || undefined });
    setEditingItem(null);
    toast.success(t("itemUpdated"));
  };
  const saveListName = (event: FormEvent) => {
    event.preventDefault();
    if (!renameValue.trim()) return;
    renameList(list.id, renameValue.trim());
    setRenameOpen(false);
    setActionsOpen(false);
    toast.success(t("listUpdated"));
  };
  const confirmDeleteList = () => {
    const removed = deleteList(list.id);
    setDeleteOpen(false);
    if (!removed) return;
    toast(t("listRemoved"), { action: { label: t("restore"), onClick: () => restoreList(removed) } });
    router.push(`/app/spaces/${space?.id ?? ""}`);
  };
  const runMove = (itemId: string, direction: -1 | 1) => {
    const index = list.items.findIndex((item) => item.id === itemId);
    if ((direction === -1 && index === 0) || (direction === 1 && index === list.items.length - 1)) {
      toast.message(locale === "fa" ? "این مورد در همین جایگاه می‌ماند." : "This item is already at the edge.");
      return;
    }
    moveItem(list.id, itemId, direction);
    toast.message(t("itemMoved"));
  };

  return <div className="page-enter">
    <div className="mb-5 flex items-center gap-2 text-[11px] text-muted"><Link href={`/app/spaces/${space?.id ?? ""}`} className="hover:text-brand">{spaceName}</Link><ChevronLeft className="size-3" /><span>{listName}</span></div>
    <PageHeader eyebrow={spaceName} title={`${list.emoji} ${listName}`} description={locale === "fa" ? "موارد را اضافه کن، جزئیات‌شان را ویرایش و پیشرفت را دنبال کن." : "Add items, edit their details and keep your group in sync."} action={<div className="flex gap-2"><Button variant="secondary" onClick={() => space && setInviteOpen(true)}><Share2 className="size-4" />{t("invite")}</Button><div className="relative"><Button variant="outline" size="icon" aria-label={t("details")} aria-expanded={actionsOpen} onClick={() => setActionsOpen((value) => !value)}><MoreHorizontal className="size-4" /></Button>{actionsOpen && <div className="absolute end-0 top-12 z-20 w-48 rounded-2xl border border-line bg-surface p-1.5 shadow-xl"><button className="w-full rounded-xl px-3 py-2.5 text-start text-xs font-medium hover:bg-soft" onClick={() => { setRenameValue(listName); setRenameOpen(true); setActionsOpen(false); }}>{t("editList")}</button><button className="w-full rounded-xl px-3 py-2.5 text-start text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => { setDeleteOpen(true); setActionsOpen(false); }}>{t("deleteList")}</button></div>}</div></div>} />
    <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card className="overflow-hidden p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="mb-1 text-xs font-semibold text-muted">{t("listCount")}</p><p className="mb-0 text-2xl font-bold">{done}<span className="text-base font-medium text-muted"> / {total} {t("done")}</span></p></div><span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><Check className="size-6" /></span></div><div className="h-2 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-gradient-to-r from-[#9e8ddd] to-brand transition-all duration-500" style={{ width: total ? `${done / total * 100}%` : "0%" }} /></div><div className="mt-2 flex justify-between text-[10px] text-muted"><span>{locale === "fa" ? "پیشرفت فهرست" : "List progress"}</span><span>{total ? Math.round(done / total * 100) : 0}%</span></div></Card>
      <Card className="flex items-center gap-3 p-5"><div className="flex -space-x-2 rtl:space-x-reverse">{["م","س","آ"].slice(0, space?.memberCount ?? 1).map((letter, index) => <span key={letter} className={`grid size-9 place-items-center rounded-full border-2 border-surface text-[10px] font-bold ${index ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200" : "bg-brand-soft text-brand"}`}>{locale === "fa" ? letter : ["M","S","A"][index]}</span>)}</div><div className="min-w-0 flex-1"><p className="mb-1 text-xs font-bold">{space?.memberCount ?? 1} {t("members")}</p><p className="mb-0 truncate text-[10px] text-muted">{t("updatedToday")}</p></div><Button variant="ghost" size="icon" className="size-8" onClick={() => space && setInviteOpen(true)} aria-label={t("invite")}><Users className="size-4" /></Button></Card>
    </div>

    <Card className="mb-5 p-3 sm:p-4"><form onSubmit={submit} className="flex gap-2"><div className="relative min-w-0 flex-1"><Plus className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-brand" /><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("itemPlaceholder")} className="h-12 border-transparent bg-soft/65 ps-10 shadow-none focus-visible:bg-surface" maxLength={80} /></div><Button type="submit" className="h-12 shrink-0 px-4"><Plus className="size-4" /><span className="hidden sm:inline">{t("addItem")}</span></Button></form><div className="mt-2 flex flex-wrap items-center justify-between gap-2"><button type="button" onClick={() => setShowDetails((value) => !value)} className="inline-flex items-center gap-1 px-1 text-[10px] font-semibold text-brand"><ChevronDown className={cn("size-3.5 transition", showDetails && "rotate-180")} />{t("details")}</button><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? "فقط در همین مرورگر ذخیره می‌شود." : "Saved in this browser only."}</p></div>{showDetails && <div className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-semibold text-muted">{t("itemNote")}<Input value={note} onChange={(event) => setNote(event.target.value)} placeholder={locale === "fa" ? "مثلاً برند دلخواه" : "e.g. preferred brand"} className="h-10 text-xs" /></label><label className="grid gap-1.5 text-[10px] font-semibold text-muted">{t("quantity")}<Input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder={t("quantityPlaceholder")} className="h-10 text-xs" /></label></div>}</Card>

    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><h2 className="mb-0 text-sm font-bold">{t("items")}</h2><Badge variant="neutral">{total}</Badge></div><div className="flex items-center gap-1 rounded-xl bg-soft/70 p-1">{(["all", "open", "done"] as const).map((value) => { const text = value === "all" ? t("all") : value === "open" ? t("filterOpen") : t("filterDone"); return <button key={value} onClick={() => setFilter(value)} className={cn("rounded-lg px-3 py-1.5 text-[10px] font-semibold transition", filter === value ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink")}>{text}</button>; })}</div></div>

    {visibleItems.length ? <div className="grid gap-2.5">{visibleItems.map((item) => <ItemRow key={item.id} item={item} onToggle={() => toggleItem(list.id, item.id)} onEdit={() => openItemEditor(item)} onDelete={() => deleteItem(item.id)} onMoveUp={() => runMove(item.id, -1)} onMoveDown={() => runMove(item.id, 1)} />)}</div> : <Card className="grid min-h-56 place-items-center p-8 text-center"><div><span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><CirclePlus className="size-5" /></span><h3 className="mb-2 text-sm font-bold">{filter === "all" ? t("emptyItems") : t("noResults")}</h3><p className="mb-0 max-w-xs text-xs leading-6 text-muted">{filter === "all" ? t("emptyItemsHelp") : locale === "fa" ? "با فیلتر دیگری موارد را ببین." : "Try a different filter to see items."}</p></div></Card>}
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Sparkles className="size-4" /></span><div><p className="mb-1 text-xs font-bold">{locale === "fa" ? "فهرست مشترک، نمونهٔ تعاملی" : "Shared list, interactive preview"}</p><p className="mb-0 text-[10px] leading-5 text-muted">{t("localOnly")}</p></div></Card>
    {space && <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} space={space} />}

    <Dialog open={renameOpen} onOpenChange={setRenameOpen}><DialogContent><DialogHeader><DialogTitle>{t("editList")}</DialogTitle><DialogDescription>{t("noBackend")}</DialogDescription></DialogHeader><form onSubmit={saveListName} className="grid gap-4"><label className="grid gap-2 text-xs font-semibold">{t("listName")}<Input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} required maxLength={48} autoFocus /></label><Button type="submit">{t("save")}</Button></form></DialogContent></Dialog>
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>{t("deleteListConfirm")}</DialogTitle><DialogDescription>{t("deleteListConfirmHelp")}</DialogDescription></DialogHeader><div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>{t("cancel")}</Button><Button variant="destructive" className="flex-1" onClick={confirmDeleteList}>{t("deleteList")}</Button></div></DialogContent></Dialog>
    <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null); }}><DialogContent><DialogHeader><DialogTitle>{t("editItem")}</DialogTitle><DialogDescription>{t("noBackend")}</DialogDescription></DialogHeader><form onSubmit={saveItemEdit} className="grid gap-4"><label className="grid gap-2 text-xs font-semibold">{t("itemPlaceholder")}<Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required maxLength={80} autoFocus /></label><label className="grid gap-2 text-xs font-semibold">{t("itemNote")}<Input value={editNote} onChange={(event) => setEditNote(event.target.value)} /></label><label className="grid gap-2 text-xs font-semibold">{t("quantity")}<Input value={editQuantity} onChange={(event) => setEditQuantity(event.target.value)} placeholder={t("quantityPlaceholder")} /></label><Button type="submit">{t("save")}</Button></form></DialogContent></Dialog>
  </div>;
}
