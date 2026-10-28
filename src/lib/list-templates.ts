import type { DemoList } from "@/lib/demo-data";

export type ListTemplate = {
  id: string;
  emoji: string;
  kind: DemoList["kind"];
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  descriptionEn: string;
  itemsFa: string[];
  itemsEn: string[];
};

export const listTemplates: ListTemplate[] = [
  { id: "weekly-shop", emoji: "🛒", kind: "shopping", nameFa: "خرید هفتگی", nameEn: "Weekly groceries", descriptionFa: "چیزهایی که خریدهای معمول را سریع‌تر می‌کنند.", descriptionEn: "A reusable starter for regular grocery runs.", itemsFa: ["میوه و سبزی", "نان", "لبنیات", "مواد پروتئینی", "مواد شوینده"], itemsEn: ["Fruit and vegetables", "Bread", "Dairy", "Protein", "Cleaning supplies"] },
  { id: "trip-pack", emoji: "🧳", kind: "travel", nameFa: "وسایل سفر", nameEn: "Packing checklist", descriptionFa: "یک چک‌لیست پایه برای سفر کوتاه.", descriptionEn: "A practical starter for a short trip.", itemsFa: ["مدارک شناسایی", "شارژر و کابل", "لباس اضافه", "داروهای ضروری", "وسایل بهداشتی"], itemsEn: ["ID and travel documents", "Chargers and cables", "Extra clothes", "Essential medication", "Toiletries"] },
  { id: "weekly-reset", emoji: "🧹", kind: "tasks", nameFa: "نظم هفتگی", nameEn: "Weekly reset", descriptionFa: "کارهای کوچک برای شروع مرتب هفته.", descriptionEn: "Small chores to get ready for the week.", itemsFa: ["مرتب‌کردن فضای مشترک", "خالی‌کردن سطل‌ها", "تعویض حوله‌ها", "آبیاری گیاهان", "برنامه‌ریزی هفته"], itemsEn: ["Tidy shared areas", "Empty the bins", "Replace towels", "Water plants", "Plan the week"] },
  { id: "shared-meal", emoji: "🍲", kind: "shopping", nameFa: "شام گروهی", nameEn: "Shared dinner", descriptionFa: "برنامه‌ریزی یک وعده با مشارکت همه.", descriptionEn: "Plan a meal together without missing the basics.", itemsFa: ["انتخاب غذا", "بررسی حساسیت غذایی", "خرید مواد اولیه", "تعیین مسئول آماده‌سازی", "هماهنگی زمان"], itemsEn: ["Choose the meal", "Check dietary needs", "Buy ingredients", "Assign prep tasks", "Agree on a time"] },
  { id: "project-kickoff", emoji: "🚀", kind: "general", nameFa: "شروع پروژه", nameEn: "Project kickoff", descriptionFa: "از هدف مشترک تا اولین قدم‌های اجرایی.", descriptionEn: "Turn a shared idea into clear next steps.", itemsFa: ["تعریف هدف", "تقسیم مسئولیت‌ها", "مشخص‌کردن موعدها", "جمع‌آوری منابع", "تعیین زمان پیگیری"], itemsEn: ["Define the goal", "Assign responsibilities", "Set target dates", "Gather resources", "Schedule a check-in"] },
  { id: "event-day", emoji: "🎉", kind: "general", nameFa: "میزبانی دورهمی", nameEn: "Host a get-together", descriptionFa: "کارهای اصلی قبل از رسیدن مهمان‌ها.", descriptionEn: "A simple checklist to make hosting easier.", itemsFa: ["تعیین تعداد مهمان‌ها", "هماهنگی خوراکی‌ها", "آماده‌کردن فضا", "تهیهٔ نوشیدنی", "هماهنگی زمان رسیدن"], itemsEn: ["Confirm the guest list", "Coordinate food", "Prepare the space", "Get drinks", "Confirm arrival time"] },
];
