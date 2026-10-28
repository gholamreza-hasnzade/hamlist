"use client";

import { useParams, useRouter } from "next/navigation";
import { Check, ChevronLeft, Link2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "@/providers/locale-provider";
import { useDemoData } from "@/providers/demo-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function InvitePreviewPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { t, locale } = useLocale();
  const { data } = useDemoData();
  const token = decodeURIComponent(params.token ?? "");
  const space = data.spaces.find((item) => token.toLowerCase().includes(item.id.toLowerCase())) ?? data.spaces[0];
  const acceptDemo = () => { toast.message(t("noBackend")); router.push(`/app/spaces/${space?.id ?? "home"}`); };
  return <main className="app-background grid min-h-screen place-items-center px-4 py-10"><div className="w-full max-w-[520px] page-enter"><div className="mb-6 flex items-center justify-between"><Link href="/app" className="flex items-center gap-2.5"><span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#8a77d2] to-[#6651b1] text-white"><Check className="size-5 stroke-[3]" /></span><span className="font-bold">{t("appName")}</span></Link><Badge variant="neutral">{t("demo")}</Badge></div><Card className="overflow-hidden"><div className="h-2 bg-gradient-to-r from-[#a99bdf] via-brand to-[#7b6bc0]" /><div className="p-6 sm:p-9"><span className="mb-5 grid size-14 place-items-center rounded-2xl bg-brand-soft text-2xl">{space?.emoji ?? "✦"}</span><p className="mb-2 text-xs font-bold text-brand">{t("invitePreview")}</p><h1 className="mb-3 text-2xl font-bold">{locale === "fa" ? "دعوت شدی به یک فضای گروهی" : "You’re invited to a shared space"}</h1><p className="mb-6 text-sm leading-7 text-muted">{locale === "fa" ? "این صفحه فقط برای نمایش مسیر دعوت است؛ پیوستن واقعی نیازمند backend و حساب کاربری خواهد بود." : "This page previews the invitation flow. A real membership requires a backend and an account."}</p><div className="mb-6 flex items-center gap-4 rounded-2xl bg-soft/60 p-4"><span className="grid size-12 place-items-center rounded-2xl bg-surface text-2xl shadow-sm">{space?.emoji ?? "✦"}</span><div className="min-w-0 flex-1"><h2 className="mb-1 truncate text-sm font-bold">{space ? (locale === "fa" ? space.nameFa : space.nameEn) : t("spaces")}</h2><p className="mb-0 text-[11px] text-muted">{space?.memberCount ?? 1} {t("members")} · {t("privateSpace")}</p></div><Users className="size-5 text-muted" /></div><div className="mb-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-line p-3"><small className="mb-1 block text-[10px] text-muted">{t("invitedBy")}</small><strong className="text-xs">{locale === "fa" ? "مهدی" : "Mahdi"}</strong></div><div className="rounded-xl border border-line p-3"><small className="mb-1 block text-[10px] text-muted">{t("role")}</small><strong className="text-xs">{t("member")}</strong></div></div><div className="mb-6 flex items-center gap-2 rounded-xl bg-brand-soft/50 p-3 text-[10px] leading-5 text-muted"><ShieldCheck className="size-4 shrink-0 text-brand" />{t("inviteHelp")}</div><Button className="w-full" size="lg" onClick={acceptDemo}><Link2 className="size-4" />{t("joinDemo")}</Button><Link href="/app" className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-muted hover:text-brand">{t("backHome")}<ChevronLeft className="size-3" /></Link></div></Card><p className="mt-5 text-center text-[10px] text-muted">{t("noBackend")}</p></div></main>;
}
