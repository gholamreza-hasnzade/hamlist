"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Check, Download, FileText, Globe2, Laptop, LockKeyhole, Moon, Palette, RotateCcw, ShieldCheck, Sun, UserRound } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { PageHeader } from "@/components/hamlist/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const { data, reset } = useDemoData();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && theme === "light";
  const isDark = mounted && theme === "dark";
  useEffect(() => setMounted(true), []);
  const [resetOpen, setResetOpen] = useState(false);
  const [name, setName] = useState(locale === "fa" ? "مهدی" : "Mahdi");
  const [saved, setSaved] = useState(false);
  const changeLanguage = (value: "fa" | "en") => { setLocale(value); setName(value === "fa" ? "مهدی" : "Mahdi"); };
  const doReset = () => { reset(); setResetOpen(false); toast.success(t("resetDone")); };
  const downloadFile = (filename: string, content: string, mime: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t("exported"));
  };
  const exportJson = () => downloadFile("hamlist-demo-export.json", JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2), "application/json;charset=utf-8");
  const exportCsv = () => {
    const spaceName = (spaceId?: string) => { const space = data.spaces.find((entry) => entry.id === spaceId); return space ? (locale === "fa" ? space.nameFa : space.nameEn) : ""; };
    const rows: (string | number | undefined)[][] = [["type", "space", "list", "title", "status", "assignee", "due", "priority", "amount", "currency", "date", "notes"]];
    data.spaces.forEach((space) => rows.push(["space", locale === "fa" ? space.nameFa : space.nameEn, "", locale === "fa" ? space.descriptionFa : space.descriptionEn, "", "", "", "", "", "", "", ""]));
    data.lists.forEach((list) => { rows.push(["list", spaceName(list.spaceId), "", locale === "fa" ? list.nameFa : list.nameEn, "", "", "", "", "", "", "", list.kind]); list.items.forEach((item) => rows.push(["list-item", spaceName(list.spaceId), locale === "fa" ? list.nameFa : list.nameEn, locale === "fa" ? item.titleFa : item.titleEn, item.done ? "done" : "open", "", "", "", "", "", "", locale === "fa" ? item.noteFa : item.noteEn])); });
    data.tasks.forEach((task) => rows.push(["task", spaceName(task.spaceId), "", locale === "fa" ? task.titleFa : task.titleEn, task.done ? "done" : "open", locale === "fa" ? task.assignedFa : task.assignedEn, task.due, task.priority, "", "", "", ""]));
    data.reminders.forEach((reminder) => rows.push(["reminder", spaceName(reminder.spaceId), "", locale === "fa" ? reminder.titleFa : reminder.titleEn, reminder.done ? "done" : "open", "", reminder.dueAt, "", "", "", "", ""]));
    data.expenses.forEach((expense) => rows.push(["expense", "", "", locale === "fa" ? expense.titleFa : expense.titleEn, expense.settled ? "settled" : "open", locale === "fa" ? expense.paidByFa : expense.paidByEn, "", "", expense.amount, expense.currency, expense.date, ""]));
    const csvCell = (value: string | number | undefined) => { let text = String(value ?? ""); if (/^[=+\-@]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
    downloadFile("hamlist-demo-export.csv", `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`, "text/csv;charset=utf-8");
  };

  return <div className="page-enter">
    <PageHeader eyebrow={t("workspace")} title={t("settings")} description={locale === "fa" ? "ظاهر و ترجیحات پیش‌نمایش HamList را تنظیم کن." : "Adjust your HamList preview preferences."} badge={t("demo")} />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid content-start gap-5">
        <Card className="overflow-hidden"><div className="flex items-center gap-3 border-b border-line p-5"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><UserRound className="size-5" /></span><div><h2 className="mb-1 text-sm font-bold">{t("profile")}</h2><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? "اطلاعات حساب در این نسخه نمایشی است." : "Profile details are sample data in this preview."}</p></div></div><div className="grid gap-4 p-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold">{t("displayName")}<Input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} /></label><label className="grid gap-2 text-xs font-semibold">{t("email")}<Input value="mahdi@example.com" readOnly className="text-muted" /></label><div className="flex items-end sm:col-span-2"><Button variant={saved ? "secondary" : "default"} size="sm" onClick={() => { setSaved(true); toast.success(locale === "fa" ? "تغییرات فقط در پیش‌نمایش ثبت شد." : "Preview settings saved."); }}>{saved && <Check className="size-4" />}{t("save")}</Button><span className="ms-3 text-[10px] text-muted">{locale === "fa" ? "ذخیره در حساب واقعی انجام نمی‌شود." : "Not saved to a real account."}</span></div></div></Card>
        <Card className="p-5"><div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><Download className="size-5" /></span><div><h2 className="mb-1 text-sm font-bold">{t("exportData")}</h2><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? "یک نسخهٔ محلی از اطلاعات نمایشی‌ات دریافت کن." : "Download a local copy of your preview data."}</p></div></div><div className="grid gap-2 sm:grid-cols-2"><Button variant="secondary" onClick={exportJson}><Download className="size-4" />{t("exportJson")}</Button><Button variant="outline" onClick={exportCsv}><FileText className="size-4" />{t("exportCsv")}</Button></div></Card>
        <Card><div className="flex items-center gap-3 border-b border-line p-5"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Globe2 className="size-5" /></span><div><h2 className="mb-1 text-sm font-bold">{t("language")}</h2><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? "زبان و جهت نوشتار رابط کاربری." : "Interface language and text direction."}</p></div></div><div className="grid gap-3 p-5 sm:grid-cols-2"><button onClick={() => changeLanguage("fa")} className={cn("flex items-center justify-between rounded-xl border p-4 text-start transition", locale === "fa" ? "border-brand bg-brand-soft/50" : "border-line hover:bg-soft/50")}><span><strong className="block text-sm">فارسی</strong><small className="text-[10px] text-muted">راست‌چین · RTL</small></span>{locale === "fa" && <Check className="size-4 text-brand" />}</button><button onClick={() => changeLanguage("en")} className={cn("flex items-center justify-between rounded-xl border p-4 text-start transition", locale === "en" ? "border-brand bg-brand-soft/50" : "border-line hover:bg-soft/50")}><span><strong className="block text-sm">English</strong><small className="text-[10px] text-muted">Left-to-right · LTR</small></span>{locale === "en" && <Check className="size-4 text-brand" />}</button></div></Card>
        <Card><div className="flex items-center gap-3 border-b border-line p-5"><span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><Palette className="size-5" /></span><div><h2 className="mb-1 text-sm font-bold">{t("appearance")}</h2><p className="mb-0 text-[10px] text-muted">{locale === "fa" ? "تم روشن و تیره با تأکید بنفش." : "Light and dark themes with violet accents."}</p></div></div><div className="grid gap-3 p-5 sm:grid-cols-2"><button onClick={() => setTheme("light")} className={cn("flex items-center gap-3 rounded-xl border p-4 text-start transition", isLight ? "border-brand bg-brand-soft/50" : "border-line hover:bg-soft/50")}><Sun className="size-5 text-brand" /><span className="flex-1"><strong className="block text-sm">{t("light")}</strong><small className="text-[10px] text-muted">{locale === "fa" ? "سفید و بنفش" : "White and violet"}</small></span>{isLight && <Check className="size-4 text-brand" />}</button><button onClick={() => setTheme("dark")} className={cn("flex items-center gap-3 rounded-xl border p-4 text-start transition", isDark ? "border-brand bg-brand-soft/50" : "border-line hover:bg-soft/50")}><Moon className="size-5 text-brand" /><span className="flex-1"><strong className="block text-sm">{t("dark")}</strong><small className="text-[10px] text-muted">{locale === "fa" ? "ایندیگو و اسلیت" : "Midnight indigo and slate"}</small></span>{isDark && <Check className="size-4 text-brand" />}</button></div></Card>
      </div>
      <aside className="grid content-start gap-5"><Card className="p-5"><div className="mb-3 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand"><ShieldCheck className="size-4" /></span><h2 className="mb-0 text-sm font-bold">{t("privacy")}</h2></div><p className="mb-4 text-xs leading-6 text-muted">{t("localOnly")}</p><div className="rounded-xl border border-line bg-surface-soft p-3"><p className="mb-1 flex items-center gap-2 text-[11px] font-bold"><LockKeyhole className="size-3.5 text-brand" />{locale === "fa" ? "حالت پیش‌نمایش" : "Preview mode"}</p><p className="mb-0 text-[10px] leading-5 text-muted">{t("noBackend")}</p></div></Card>
        <Card className="p-5"><div className="mb-3 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40"><RotateCcw className="size-4" /></span><h2 className="mb-0 text-sm font-bold">{locale === "fa" ? "داده‌های نمونه" : "Sample data"}</h2></div><p className="mb-4 text-xs leading-6 text-muted">{locale === "fa" ? "تغییرات فهرست‌ها و کارها در همین مرورگر ذخیره می‌شوند." : "Changes to lists and tasks are saved in this browser."}</p><Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40" onClick={() => setResetOpen(true)}><RotateCcw className="size-4" />{t("resetDemo")}</Button></Card>
        <Card className="border-brand/15 bg-brand-soft/35 p-5"><div className="mb-2 flex items-center gap-2"><Laptop className="size-4 text-brand" /><Badge variant="default" className="border-0">{locale === "fa" ? "مرحلهٔ بعد" : "Next step"}</Badge></div><h3 className="mb-1 text-sm font-bold">{locale === "fa" ? "پشتیبانی از PWA" : "PWA support"}</h3><p className="mb-0 text-[11px] leading-5 text-muted">{t("pwaProgress")}</p></Card>
      </aside>
    </div>
    <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent><DialogHeader><DialogTitle>{t("resetConfirm")}</DialogTitle><DialogDescription>{t("resetConfirmHelp")}</DialogDescription></DialogHeader><div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setResetOpen(false)}>{t("cancel")}</Button><Button variant="destructive" className="flex-1" onClick={doReset}><RotateCcw className="size-4" />{t("resetDemo")}</Button></div></DialogContent></Dialog>
  </div>;
}
