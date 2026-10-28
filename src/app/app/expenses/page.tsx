"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, CircleDollarSign, Plus, ReceiptText, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ExpensesPage() {
  const { t, locale } = useLocale();
  const { data, addExpense } = useDemoData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const total = useMemo(() => data.expenses.reduce((sum, expense) => sum + expense.amount, 0), [data.expenses]);
  const formatMoney = (value: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value);
  const formatDate = (date: string) => new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
  const submit = (event: FormEvent) => { event.preventDefault(); const value = Number(amount); if (!title.trim() || !value || value < 0) return; addExpense(title.trim(), value); setTitle(""); setAmount(""); setOpen(false); toast.success(locale === "fa" ? "هزینهٔ نمونه ثبت شد." : "Sample expense added."); };
  const payerAvatar = (name: string) => name.slice(0, 1);

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("sharedExpenses")} description={locale === "fa" ? "ثبت نمایشی هزینه‌های مشترک برای شفافیت گروه." : "A lightweight sample ledger for shared group costs."} action={<Button onClick={() => setOpen(true)}><Plus className="size-4" />{t("addExpense")}</Button>} />
    <Card className="mb-6 overflow-hidden border-brand/15 bg-gradient-to-br from-[#f3f0fc] via-white to-[#fbfaff] p-5 dark:from-[#26243b] dark:via-[#202432] dark:to-[#24273a] sm:p-7"><div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center"><div><Badge variant="default" className="mb-4 border-0"><WalletCards className="size-3.5" />{t("sampleData")}</Badge><p className="mb-1 text-xs font-semibold text-muted">{t("totalSpent")}</p><p className="mb-2 text-4xl font-bold tracking-tight text-ink">{formatMoney(total)}</p><p className="mb-5 max-w-xl text-xs leading-6 text-muted">{t("noPayment")}</p><div className="flex flex-wrap gap-x-6 gap-y-3"><div><p className="mb-1 text-[10px] text-muted">{t("yourShare")}</p><strong className="text-base">{formatMoney(total / 3)}</strong></div><div><p className="mb-1 text-[10px] text-muted">{locale === "fa" ? "تعداد ثبت‌ها" : "Entries"}</p><strong className="text-base">{data.expenses.length}</strong></div></div></div><div className="relative mx-auto grid size-44 place-items-center"><div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#7661c0 0 42%, #a799dc 42% 72%, #ded8f0 72% 100%)" }} /><div className="grid size-[126px] place-items-center rounded-full bg-surface text-center shadow-inner"><span><CircleDollarSign className="mx-auto mb-1 size-5 text-brand" /><strong className="block text-lg">{formatMoney(total / 3)}</strong><small className="text-[9px] text-muted">{t("yourShare")}</small></span></div></div></div></Card>
    <div className="mb-4 flex items-center justify-between"><div><h2 className="mb-1 text-base font-bold">{t("expenses")}</h2><p className="mb-0 text-xs text-muted">{locale === "fa" ? "آخرین هزینه‌های ثبت‌شده در فضای نمونه." : "Recent entries in this sample space."}</p></div><Badge variant="neutral">{data.expenses.length} {t("items")}</Badge></div>
    <div className="grid gap-3">{data.expenses.map((expense, index) => <Card key={expense.id} className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${index % 3 === 0 ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200" : index % 3 === 1 ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"}`}><ReceiptText className="size-5" /></span><div className="min-w-0 flex-1"><p className="mb-1 truncate text-sm font-bold">{locale === "fa" ? expense.titleFa : expense.titleEn}</p><div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted"><span className="inline-flex items-center gap-1"><span className="grid size-4 place-items-center rounded-full bg-brand-soft text-[8px] font-bold text-brand">{payerAvatar(locale === "fa" ? expense.paidByFa : expense.paidByEn)}</span>{locale === "fa" ? expense.paidByFa : expense.paidByEn}</span><span>·</span><span>{formatDate(expense.date)}</span></div></div><div className="text-end"><p className="mb-1 text-base font-bold">{formatMoney(expense.amount)}</p><Badge variant="neutral" className="border-0">{locale === "fa" ? "تقسیم نمایشی" : "Sample split"}</Badge></div></Card>)}</div>
    <Card className="mt-6 flex items-start gap-3 border-dashed bg-surface/60 p-4"><Check className="mt-0.5 size-4 shrink-0 text-brand" /><p className="mb-0 text-[11px] leading-5 text-muted">{t("noPayment")} {t("localOnly")}</p></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{t("addExpense")}</DialogTitle><DialogDescription>{t("noPayment")}</DialogDescription></DialogHeader><form className="grid gap-4" onSubmit={submit}><label className="grid gap-2 text-xs font-semibold">{t("expenseName")}<Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("expensePlaceholder")} required autoFocus maxLength={60} /></label><label className="grid gap-2 text-xs font-semibold">{t("amount")} (€)<Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("amountPlaceholder")} min="0.01" step="0.01" required /></label><div className="rounded-xl bg-soft/60 p-3 text-[11px] leading-5 text-muted">{t("localOnly")}</div><Button type="submit">{t("save")}</Button></form></DialogContent></Dialog>
  </div>;
}
