export type DemoItem = {
  id: string;
  titleFa: string;
  titleEn: string;
  noteFa?: string;
  noteEn?: string;
  done: boolean;
  quantity?: string;
};

export type DemoList = {
  id: string;
  spaceId: string;
  nameFa: string;
  nameEn: string;
  emoji: string;
  kind: "shopping" | "tasks" | "travel" | "general";
  items: DemoItem[];
};

export type DemoSpace = { id: string; nameFa: string; nameEn: string; emoji: string; memberCount: number; descriptionFa: string; descriptionEn: string };
export type DemoAssignee = "me" | "mahdi" | "sara" | "arman" | "unassigned";
export type DemoTask = { id: string; titleFa: string; titleEn: string; spaceId: string; assignedFa: string; assignedEn: string; due: "today" | "tomorrow" | "week" | "none"; done: boolean; priority: "high" | "normal" };
export type DemoReminder = { id: string; titleFa: string; titleEn: string; spaceId: string; dueAt: string; done: boolean };
export type DemoActivity = { id: string; type: "space" | "list" | "item" | "task" | "reminder" | "expense"; actionFa: string; actionEn: string; titleFa: string; titleEn: string; spaceId?: string; createdAt: string };
export type DemoExpense = { id: string; titleFa: string; titleEn: string; amount: number; currency: string; paidByFa: string; paidByEn: string; date: string; settled: boolean };
export type DemoState = { spaces: DemoSpace[]; lists: DemoList[]; tasks: DemoTask[]; reminders: DemoReminder[]; expenses: DemoExpense[]; activity: DemoActivity[] };

export const initialDemoState: DemoState = {
  spaces: [
    { id: "home", nameFa: "خانه", nameEn: "Home", emoji: "⌂", memberCount: 3, descriptionFa: "کارهای روزمره و خریدهای مشترک", descriptionEn: "Everyday tasks and shared shopping" },
    { id: "friends", nameFa: "سفر آخر هفته", nameEn: "Weekend trip", emoji: "✦", memberCount: 4, descriptionFa: "برنامه‌ریزی سفر با دوستان", descriptionEn: "Planning a getaway with friends" },
    { id: "personal", nameFa: "شخصی", nameEn: "Personal", emoji: "◒", memberCount: 1, descriptionFa: "فهرست‌های خودت", descriptionEn: "Your own lists" },
  ],
  lists: [
    { id: "groceries", spaceId: "home", nameFa: "خرید این هفته", nameEn: "This week’s groceries", emoji: "🛒", kind: "shopping", items: [
      { id: "i1", titleFa: "نان و شیر", titleEn: "Bread and milk", quantity: "۲ عدد", noteFa: "نان سبوس‌دار", noteEn: "Wholegrain bread", done: false },
      { id: "i2", titleFa: "قهوه", titleEn: "Coffee", quantity: "۱ بسته", done: false },
      { id: "i3", titleFa: "میوهٔ فصل", titleEn: "Seasonal fruit", noteFa: "اضافه‌شده توسط سارا", noteEn: "Added by Sara", done: true },
      { id: "i4", titleFa: "مایع ظرف‌شویی", titleEn: "Dish soap", done: false },
    ] },
    { id: "weekly", spaceId: "home", nameFa: "کارهای این هفته", nameEn: "This week’s tasks", emoji: "☑", kind: "tasks", items: [
      { id: "i5", titleFa: "آبیاری گلدان‌ها", titleEn: "Water the plants", noteFa: "امروز · مهدی", noteEn: "Today · Mahdi", done: false },
      { id: "i6", titleFa: "بردن بازیافت", titleEn: "Take out recycling", noteFa: "فردا · سارا", noteEn: "Tomorrow · Sara", done: true },
      { id: "i7", titleFa: "مرتب‌کردن انباری", titleEn: "Tidy the storage room", done: false },
    ] },
    { id: "trip", spaceId: "friends", nameFa: "آماده‌سازی سفر", nameEn: "Trip checklist", emoji: "✈️", kind: "travel", items: [
      { id: "i8", titleFa: "رزرو اقامتگاه", titleEn: "Book accommodation", noteFa: "تا پنجشنبه", noteEn: "By Thursday", done: false },
      { id: "i9", titleFa: "کارت شناسایی", titleEn: "ID cards", done: true },
      { id: "i10", titleFa: "وسایل پیک‌نیک", titleEn: "Picnic supplies", done: false },
    ] },
    { id: "personal-list", spaceId: "personal", nameFa: "ایده‌های آخر هفته", nameEn: "Weekend ideas", emoji: "✎", kind: "general", items: [
      { id: "i11", titleFa: "رفتن به نمایشگاه", titleEn: "Visit the gallery", done: false },
      { id: "i12", titleFa: "تماس با خانواده", titleEn: "Call family", done: true },
    ] },
  ],
  tasks: [
    { id: "t1", titleFa: "مرتب‌کردن خرید هفتگی", titleEn: "Put away the weekly shop", spaceId: "home", assignedFa: "مهدی", assignedEn: "Mahdi", due: "today", done: false, priority: "high" },
    { id: "t2", titleFa: "آماده‌کردن وسایل پیک‌نیک", titleEn: "Pack picnic supplies", spaceId: "friends", assignedFa: "خودم", assignedEn: "Me", due: "tomorrow", done: false, priority: "normal" },
    { id: "t3", titleFa: "پرداخت قبض اینترنت", titleEn: "Pay the internet bill", spaceId: "home", assignedFa: "سارا", assignedEn: "Sara", due: "week", done: false, priority: "normal" },
    { id: "t4", titleFa: "مرتب‌کردن انباری", titleEn: "Tidy the storage room", spaceId: "home", assignedFa: "—", assignedEn: "—", due: "none", done: true, priority: "normal" },
  ],
  reminders: [
    { id: "r1", titleFa: "مرتب‌کردن خرید هفتگی", titleEn: "Put away the weekly shop", spaceId: "home", dueAt: "2026-10-28T18:00", done: false },
    { id: "r2", titleFa: "آماده‌کردن وسایل پیک‌نیک", titleEn: "Pack picnic supplies", spaceId: "friends", dueAt: "2026-10-29T10:00", done: false },
    { id: "r3", titleFa: "پرداخت قبض اینترنت", titleEn: "Pay the internet bill", spaceId: "home", dueAt: "2026-10-30T12:00", done: false },
  ],
  expenses: [
    { id: "e1", titleFa: "خرید هفتگی", titleEn: "Weekly groceries", amount: 48, currency: "€", paidByFa: "مهدی", paidByEn: "Mahdi", date: "2026-10-26", settled: false },
    { id: "e2", titleFa: "قبض اینترنت", titleEn: "Internet bill", amount: 36, currency: "€", paidByFa: "سارا", paidByEn: "Sara", date: "2026-10-24", settled: true },
    { id: "e3", titleFa: "مواد پیک‌نیک", titleEn: "Picnic supplies", amount: 22.5, currency: "€", paidByFa: "آرمان", paidByEn: "Arman", date: "2026-10-22", settled: false },
  ],
  activity: [],
};

export function cloneInitialData(): DemoState {
  return JSON.parse(JSON.stringify(initialDemoState)) as DemoState;
}
