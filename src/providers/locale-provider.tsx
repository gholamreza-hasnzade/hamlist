"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { messages, type Locale, type TranslationKey } from "@/lib/i18n";

type LocaleContextValue = { locale: Locale; dir: "rtl" | "ltr"; setLocale: (locale: Locale) => void; t: (key: TranslationKey) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  useEffect(() => {
    const stored = window.localStorage.getItem("hamlist-locale");
    const next = stored === "en" ? "en" : "fa";
    setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
  }, []);
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("hamlist-locale", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
  }, []);
  const value = useMemo(() => ({
    locale, dir: locale === "fa" ? "rtl" as const : "ltr" as const, setLocale,
    t: (key: TranslationKey) => messages[locale][key] ?? messages.en[key],
  }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
