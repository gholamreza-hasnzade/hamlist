"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cloneInitialData, type DemoActivity, type DemoAssignee, type DemoExpense, type DemoItem, type DemoList, type DemoReminder, type DemoState, type DemoTask } from "@/lib/demo-data";

const STORAGE_KEY = "hamlist-demo-data-v1";
type CreateListInput = { spaceId: string; name: string; kind: DemoList["kind"] };
type TaskEditInput = { title: string; due: DemoTask["due"]; priority: DemoTask["priority"]; spaceId: string; assignee: DemoAssignee };
type ActivityInput = { type: DemoActivity["type"]; actionFa: string; actionEn: string; titleFa: string; titleEn: string; spaceId?: string };
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const logActivity = (activity: DemoActivity[], input: ActivityInput) => [{ id: makeId("event"), ...input, createdAt: new Date().toISOString() }, ...activity].slice(0, 100);
const assigneeNames: Record<DemoAssignee, { fa: string; en: string }> = {
  me: { fa: "خودم", en: "Me" }, mahdi: { fa: "مهدی", en: "Mahdi" },
  sara: { fa: "سارا", en: "Sara" }, arman: { fa: "آرمان", en: "Arman" }, unassigned: { fa: "—", en: "—" },
};

type DemoContextValue = {
  data: DemoState; ready: boolean; createSpace: (name: string) => string; createList: (input: CreateListInput) => string; createListFromTemplate: (input: { spaceId: string; nameFa: string; nameEn: string; kind: DemoList["kind"]; items: { fa: string; en: string }[] }) => string; duplicateList: (listId: string, suffix: string) => string | undefined;
  addItem: (listId: string, title: string, note?: string, quantity?: string) => void;
  editItem: (listId: string, itemId: string, input: { title: string; note?: string; quantity?: string }) => void;
  moveItem: (listId: string, itemId: string, direction: -1 | 1) => void; toggleItem: (listId: string, itemId: string) => void; setAllItemsDone: (listId: string, done: boolean) => void;
  removeItem: (listId: string, itemId: string) => DemoItem | undefined; restoreItem: (listId: string, item: DemoItem) => void;
  renameList: (listId: string, name: string) => void; deleteList: (listId: string) => DemoList | undefined; restoreList: (list: DemoList) => void;
  toggleTask: (taskId: string) => void; addTask: (title: string, due: DemoTask["due"], spaceId: string, assignee: DemoAssignee, priority: DemoTask["priority"]) => void;
  editTask: (taskId: string, input: TaskEditInput) => void; deleteTask: (taskId: string) => DemoTask | undefined; restoreTask: (task: DemoTask) => void;
  addReminder: (title: string, dueAt: string, spaceId: string) => void; updateReminder: (reminderId: string, dueAt: string) => void; toggleReminder: (reminderId: string) => void;
  addExpense: (title: string, amount: number) => void; toggleExpenseSettlement: (expenseId: string) => void; clearActivity: () => void; reset: () => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoState>(cloneInitialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DemoState>;
        const initial = cloneInitialData();
        setData({
          ...initial,
          ...saved,
          reminders: Array.isArray(saved.reminders) ? saved.reminders : initial.reminders,
          expenses: Array.isArray(saved.expenses) ? saved.expenses.map((expense) => ({ ...expense, settled: expense.settled ?? false })) : initial.expenses,
          activity: Array.isArray(saved.activity) ? saved.activity : initial.activity,
        });
      }
    } catch { /* Keep the bundled sample if browser storage is unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Demo remains in memory. */ }
  }, [data, ready]);

  const createSpace = useCallback((name: string) => {
    const id = makeId("space");
    setData((current) => ({ ...current, spaces: [{ id, nameFa: name, nameEn: name, emoji: "✦", memberCount: 1, descriptionFa: "فضای تازه", descriptionEn: "A new shared space" }, ...current.spaces], activity: logActivity(current.activity, { type: "space", actionFa: "فضای تازه ساخت", actionEn: "created a space", titleFa: name, titleEn: name, spaceId: id }) }));
    return id;
  }, []);
  const createList = useCallback(({ spaceId, name, kind }: CreateListInput) => {
    const id = makeId("list");
    const emoji = kind === "shopping" ? "🛒" : kind === "travel" ? "✈️" : kind === "tasks" ? "☑" : "✎";
    setData((current) => ({ ...current, lists: [{ id, spaceId, nameFa: name, nameEn: name, emoji, kind, items: [] }, ...current.lists], activity: logActivity(current.activity, { type: "list", actionFa: "فهرست تازه ساخته شد", actionEn: "created a new list", titleFa: name, titleEn: name, spaceId }) }));
    return id;
  }, []);
  const createListFromTemplate = useCallback(({ spaceId, nameFa, nameEn, kind, items }: { spaceId: string; nameFa: string; nameEn: string; kind: DemoList["kind"]; items: { fa: string; en: string }[] }) => {
    const id = makeId("list");
    const emoji = kind === "shopping" ? "🛒" : kind === "travel" ? "✈️" : kind === "tasks" ? "☑" : "✎";
    const newItems: DemoItem[] = items.map((item) => ({ id: makeId("item"), titleFa: item.fa, titleEn: item.en, done: false }));
    setData((current) => ({ ...current, lists: [{ id, spaceId, nameFa, nameEn, emoji, kind, items: newItems }, ...current.lists], activity: logActivity(current.activity, { type: "list", actionFa: "فهرست آماده ساخت", actionEn: "created a starter list", titleFa: nameFa, titleEn: nameEn, spaceId }) }));
    return id;
  }, []);
  const duplicateList = useCallback((listId: string, suffix: string) => {
    const original = data.lists.find((list) => list.id === listId);
    if (!original) return undefined;
    const id = makeId("list");
    const duplicate: DemoList = { ...original, id, nameFa: `${original.nameFa} - ${suffix}`, nameEn: `${original.nameEn} - ${suffix}`, items: original.items.map((item) => ({ ...item, id: makeId("item") })) };
    setData((current) => ({ ...current, lists: [duplicate, ...current.lists], activity: logActivity(current.activity, { type: "list", actionFa: "از فهرست نسخه گرفت", actionEn: "duplicated a list", titleFa: duplicate.nameFa, titleEn: duplicate.nameEn, spaceId: duplicate.spaceId }) }));
    return id;
  }, [data]);
  const addItem = useCallback((listId: string, title: string, note?: string, quantity?: string) => {
    const item: DemoItem = { id: makeId("item"), titleFa: title, titleEn: title, noteFa: note, noteEn: note, quantity, done: false };
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: [...list.items, item] } : list), activity: logActivity(current.activity, { type: "item", actionFa: "مورد اضافه کرد", actionEn: "added an item", titleFa: title, titleEn: title, spaceId: current.lists.find((list) => list.id === listId)?.spaceId }) }));
  }, []);
  const editItem = useCallback((listId: string, itemId: string, input: { title: string; note?: string; quantity?: string }) => {
    const list = data.lists.find((entry) => entry.id === listId);
    setData((current) => ({ ...current, lists: current.lists.map((entry) => entry.id === listId ? { ...entry, items: entry.items.map((item) => item.id === itemId ? { ...item, titleFa: input.title, titleEn: input.title, noteFa: input.note, noteEn: input.note, quantity: input.quantity } : item) } : entry), activity: logActivity(current.activity, { type: "item", actionFa: "مورد را ویرایش کرد", actionEn: "edited an item", titleFa: input.title, titleEn: input.title, spaceId: list?.spaceId }) }));
  }, [data]);
  const moveItem = useCallback((listId: string, itemId: string, direction: -1 | 1) => {
    setData((current) => ({ ...current, lists: current.lists.map((list) => {
      if (list.id !== listId) return list;
      const from = list.items.findIndex((item) => item.id === itemId);
      const to = Math.max(0, Math.min(list.items.length - 1, from + direction));
      if (from < 0 || from === to) return list;
      const items = [...list.items];
      [items[from], items[to]] = [items[to], items[from]];
      return { ...list, items };
    }) }));
  }, []);
  const toggleItem = useCallback((listId: string, itemId: string) => {
    const list = data.lists.find((entry) => entry.id === listId);
    const item = list?.items.find((entry) => entry.id === itemId);
    if (!item) return;
    setData((current) => ({ ...current, lists: current.lists.map((entry) => entry.id === listId ? { ...entry, items: entry.items.map((value) => value.id === itemId ? { ...value, done: !value.done } : value) } : entry), activity: logActivity(current.activity, { type: "item", actionFa: item.done ? "مورد را دوباره باز کرد" : "مورد را انجام داد", actionEn: item.done ? "reopened an item" : "completed an item", titleFa: item.titleFa, titleEn: item.titleEn, spaceId: list?.spaceId }) }));
  }, [data]);
  const setAllItemsDone = useCallback((listId: string, done: boolean) => {
    const list = data.lists.find((entry) => entry.id === listId);
    if (!list || !list.items.some((item) => item.done !== done)) return;
    setData((current) => ({ ...current, lists: current.lists.map((entry) => entry.id === listId ? { ...entry, items: entry.items.map((item) => ({ ...item, done })) } : entry), activity: logActivity(current.activity, { type: "item", actionFa: done ? "همهٔ موارد را انجام داد" : "موارد انجام‌شده را باز کرد", actionEn: done ? "completed all list items" : "reopened completed list items", titleFa: list.nameFa, titleEn: list.nameEn, spaceId: list.spaceId }) }));
  }, [data]);
  const removeItem = useCallback((listId: string, itemId: string) => {
    const removed = data.lists.find((list) => list.id === listId)?.items.find((item) => item.id === itemId);
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list) }));
    return removed;
  }, [data]);
  const restoreItem = useCallback((listId: string, item: DemoItem) => {
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: [...list.items, item] } : list) }));
  }, []);
  const renameList = useCallback((listId: string, name: string) => {
    const list = data.lists.find((entry) => entry.id === listId);
    setData((current) => ({ ...current, lists: current.lists.map((entry) => entry.id === listId ? { ...entry, nameFa: name, nameEn: name } : entry), activity: logActivity(current.activity, { type: "list", actionFa: "نام فهرست را تغییر داد", actionEn: "renamed a list", titleFa: name, titleEn: name, spaceId: list?.spaceId }) }));
  }, [data]);
  const deleteList = useCallback((listId: string) => {
    const removed = data.lists.find((list) => list.id === listId);
    setData((current) => ({ ...current, lists: current.lists.filter((list) => list.id !== listId) }));
    return removed;
  }, [data]);
  const restoreList = useCallback((list: DemoList) => {
    setData((current) => ({ ...current, lists: [list, ...current.lists] }));
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    const task = data.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    setData((current) => ({ ...current, tasks: current.tasks.map((entry) => entry.id === taskId ? { ...entry, done: !entry.done } : entry), activity: logActivity(current.activity, { type: "task", actionFa: task.done ? "کار را دوباره باز کرد" : "کار را انجام داد", actionEn: task.done ? "reopened a task" : "completed a task", titleFa: task.titleFa, titleEn: task.titleEn, spaceId: task.spaceId }) }));
  }, [data]);
  const addTask = useCallback((title: string, due: DemoTask["due"], spaceId: string, assignee: DemoAssignee, priority: DemoTask["priority"]) => {
    const names = assigneeNames[assignee];
    const task: DemoTask = { id: makeId("task"), titleFa: title, titleEn: title, spaceId, assignedFa: names.fa, assignedEn: names.en, due, done: false, priority };
    setData((current) => ({ ...current, tasks: [task, ...current.tasks], activity: logActivity(current.activity, { type: "task", actionFa: "کار تازه ساخت", actionEn: "created a task", titleFa: title, titleEn: title, spaceId }) }));
  }, []);
  const editTask = useCallback((taskId: string, input: TaskEditInput) => {
    const names = assigneeNames[input.assignee];
    setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === taskId ? { ...task, titleFa: input.title, titleEn: input.title, due: input.due, priority: input.priority, spaceId: input.spaceId, assignedFa: names.fa, assignedEn: names.en } : task), activity: logActivity(current.activity, { type: "task", actionFa: "کار را ویرایش کرد", actionEn: "edited a task", titleFa: input.title, titleEn: input.title, spaceId: input.spaceId }) }));
  }, []);
  const deleteTask = useCallback((taskId: string) => {
    const removed = data.tasks.find((task) => task.id === taskId);
    setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== taskId) }));
    return removed;
  }, [data]);
  const restoreTask = useCallback((task: DemoTask) => {
    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  }, []);

  const addReminder = useCallback((title: string, dueAt: string, spaceId: string) => {
    const reminder: DemoReminder = { id: makeId("reminder"), titleFa: title, titleEn: title, spaceId, dueAt, done: false };
    setData((current) => ({ ...current, reminders: [reminder, ...current.reminders], activity: logActivity(current.activity, { type: "reminder", actionFa: "یادآور تازه تنظیم کرد", actionEn: "set a reminder", titleFa: title, titleEn: title, spaceId }) }));
  }, []);
  const updateReminder = useCallback((reminderId: string, dueAt: string) => {
    const reminder = data.reminders.find((entry) => entry.id === reminderId);
    setData((current) => ({ ...current, reminders: current.reminders.map((entry) => entry.id === reminderId ? { ...entry, dueAt } : entry), activity: reminder ? logActivity(current.activity, { type: "reminder", actionFa: "زمان یادآور را تغییر داد", actionEn: "rescheduled a reminder", titleFa: reminder.titleFa, titleEn: reminder.titleEn, spaceId: reminder.spaceId }) : current.activity }));
  }, [data]);
  const toggleReminder = useCallback((reminderId: string) => {
    const reminder = data.reminders.find((entry) => entry.id === reminderId);
    if (!reminder) return;
    setData((current) => ({ ...current, reminders: current.reminders.map((entry) => entry.id === reminderId ? { ...entry, done: !entry.done } : entry), activity: logActivity(current.activity, { type: "reminder", actionFa: reminder.done ? "یادآور را دوباره باز کرد" : "یادآور را انجام داد", actionEn: reminder.done ? "reopened a reminder" : "completed a reminder", titleFa: reminder.titleFa, titleEn: reminder.titleEn, spaceId: reminder.spaceId }) }));
  }, [data]);

  const addExpense = useCallback((title: string, amount: number) => {
    const expense: DemoExpense = { id: makeId("expense"), titleFa: title, titleEn: title, amount, currency: "€", paidByFa: "مهدی", paidByEn: "Mahdi", date: new Date().toISOString().slice(0, 10), settled: false };
    setData((current) => ({ ...current, expenses: [expense, ...current.expenses], activity: logActivity(current.activity, { type: "expense", actionFa: "هزینه‌ای ثبت کرد", actionEn: "recorded an expense", titleFa: title, titleEn: title }) }));
  }, []);
  const toggleExpenseSettlement = useCallback((expenseId: string) => {
    const expense = data.expenses.find((entry) => entry.id === expenseId);
    if (!expense) return;
    setData((current) => ({ ...current, expenses: current.expenses.map((entry) => entry.id === expenseId ? { ...entry, settled: !entry.settled } : entry), activity: logActivity(current.activity, { type: "expense", actionFa: expense.settled ? "وضعیت تسویه را باز کرد" : "هزینه را تسویه‌شده علامت زد", actionEn: expense.settled ? "reopened an expense settlement" : "marked an expense settled", titleFa: expense.titleFa, titleEn: expense.titleEn }) }));
  }, [data]);
  const clearActivity = useCallback(() => { setData((current) => ({ ...current, activity: [] })); }, []);
  const reset = useCallback(() => { setData(cloneInitialData()); window.localStorage.removeItem(STORAGE_KEY); }, []);

  const value = useMemo(() => ({ data, ready, createSpace, createList, createListFromTemplate, duplicateList, addItem, editItem, moveItem, toggleItem, setAllItemsDone, removeItem, restoreItem, renameList, deleteList, restoreList, toggleTask, addTask, editTask, deleteTask, restoreTask, addReminder, updateReminder, toggleReminder, addExpense, toggleExpenseSettlement, clearActivity, reset }), [data, ready, createSpace, createList, createListFromTemplate, duplicateList, addItem, editItem, moveItem, toggleItem, setAllItemsDone, removeItem, restoreItem, renameList, deleteList, restoreList, toggleTask, addTask, editTask, deleteTask, restoreTask, addReminder, updateReminder, toggleReminder, addExpense, toggleExpenseSettlement, clearActivity, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemoData must be used inside DemoDataProvider");
  return context;
}
