"use client";
import { useState } from "react";
import { Copy, Link2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/providers/locale-provider";
import type { DemoSpace } from "@/lib/demo-data";

export function InviteDialog({ open, onOpenChange, space }: { open: boolean; onOpenChange: (open: boolean) => void; space: DemoSpace }) {
  const { locale, t } = useLocale();
  const [role, setRole] = useState("member");
  const sampleUrl = `https://hamlist.example/invite/${space.id.toUpperCase()}-DEMO`;
  const copy = async () => { try { await navigator.clipboard.writeText(sampleUrl); toast.success(t("copied")); } catch { toast.message(locale === "fa" ? "این لینک نمایشی را می‌توانی دستی انتخاب کنی." : "Select this demo link to copy it manually."); } };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{t("inviteTitle")}</DialogTitle><DialogDescription>{t("inviteHelp")}</DialogDescription></DialogHeader>
    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-soft/60 p-4"><span className="grid size-11 place-items-center rounded-2xl bg-surface text-xl shadow-sm">{space.emoji}</span><div><p className="mb-0.5 text-sm font-bold">{locale === "fa" ? space.nameFa : space.nameEn}</p><p className="mb-0 text-[11px] text-muted">{space.memberCount} {t("members")} · {t("privateSpace")}</p></div></div>
    <label className="mb-2 block text-xs font-semibold">{t("role")}</label><select value={role} onChange={(e) => setRole(e.target.value)} className="mb-4 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink"><option value="member">{t("member")} — {locale === "fa" ? "مشاهده و ویرایش" : "View and edit"}</option><option value="viewer">{t("viewOnly")}</option></select>
    <div className="mb-3 flex items-center gap-2 rounded-xl border border-dashed border-line bg-surface-soft p-3"><Link2 className="size-4 shrink-0 text-brand" /><code className="min-w-0 flex-1 truncate text-[11px] text-muted" dir="ltr">{sampleUrl}</code><ShieldCheck className="size-4 shrink-0 text-muted" /></div><p className="mb-5 flex items-center gap-1.5 text-[10px] leading-5 text-muted"><Users className="size-3.5 shrink-0" />{t("inviteHelp")}</p>
    <Button className="w-full" onClick={copy}><Copy className="size-4" />{t("copyLink")}</Button>
  </DialogContent></Dialog>;
}
