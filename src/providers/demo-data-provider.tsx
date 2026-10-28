"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cloneInitialData, type DemoExpense, type DemoItem, type DemoList, type DemoState, type DemoTask } from "@/lib/demo-data";

const STORAGE_KEY = "hamlist-demo-data-v1";
type CreateListInput = { spaceId: string; name: string; kind: DemoList["kind"] };
type DemoContextValue = {
  data: DemoState; ready: boolean; createSpace: (name: string) => string; createList: (input: CreateListInput) => string;
  addItem: (listId: string, title: string, note?: string, quantity?: string) => void; editItem: (listId: string, itemId: string, input: { title: string; note?: string; quantity?: string }) => void; moveItem: (listId: string, itemId: string, direction: -1 | 1) => void; toggleItem: (listId: string, itemId: string) => void;
  removeItem: (listId: string, itemId: string) => DemoItem | undefined; restoreItem: (listId: string, item: DemoItem) => void;
  renameList: (listId: string, name: string) => void; deleteList: (listId: string) => DemoList | undefined; restoreList: (list: DemoList) => void;
  toggleTask: (taskId: string) => void; addTask: (title: string, due: DemoTask["due"], spaceId: string) => void; addExpense: (title: string, amount: number) => void; reset: () => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoState>(cloneInitialData);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as DemoState);
    } catch { /* Keep the bundled sample if browser storage is unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Demo remains in memory. */ }
    }
  }, [data, ready]);

  const createSpace = useCallback((name: string) => {
    const id = `space-${Date.now()}`;
    setData((current) => ({ ...current, spaces: [{ id, nameFa: name, nameEn: name, emoji: "✦", memberCount: 1, descriptionFa: "فضای تازه", descriptionEn: "A new shared space" }, ...current.spaces] }));
    return id;
  }, []);
  const createList = useCallback(({ spaceId, name, kind }: CreateListInput) => {
    const id = `list-${Date.now()}`;
    const emoji = kind === "shopping" ? "🛒" : kind === "travel" ? "✈️" : kind === "tasks" ? "☑" : "✎";
    setData((current) => ({ ...current, lists: [{ id, spaceId, nameFa: name, nameEn: name, emoji, kind, items: [] }, ...current.lists] }));
    return id;
  }, []);
  const addItem = useCallback((listId: string, title: string, note?: string, quantity?: string) => {
    const item: DemoItem = { id: `item-${Date.now()}`, titleFa: title, titleEn: title, noteFa: note, noteEn: note, quantity, done: false };
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: [...list.items, item] } : list) }));
  }, []);
  const editItem = useCallback((listId: string, itemId: string, input: { title: string; note?: string; quantity?: string }) => {
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, titleFa: input.title, titleEn: input.title, noteFa: input.note, noteEn: input.note, quantity: input.quantity } : item) } : list) }));
  }, []);
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
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, done: !item.done } : item) } : list) }));
  }, []);
  const removeItem = useCallback((listId: string, itemId: string) => {
    const removed = data.lists.find((list) => list.id === listId)?.items.find((item) => item.id === itemId);
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list) }));
    return removed;
  }, [data]);
  const restoreItem = useCallback((listId: string, item: DemoItem) => {
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, items: [...list.items, item] } : list) }));
  }, []);
  const renameList = useCallback((listId: string, name: string) => {
    setData((current) => ({ ...current, lists: current.lists.map((list) => list.id === listId ? { ...list, nameFa: name, nameEn: name } : list) }));
  }, []);
  const deleteList = useCallback((listId: string) => {
    const removed = data.lists.find((list) => list.id === listId);
    setData((current) => ({ ...current, lists: current.lists.filter((list) => list.id !== listId) }));
    return removed;
  }, [data]);
  const restoreList = useCallback((list: DemoList) => {
    setData((current) => ({ ...current, lists: [list, ...current.lists] }));
  }, []);
  const toggleTask = useCallback((taskId: string) => {
    setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task) }));
  }, []);
  const addTask = useCallback((title: string, due: DemoTask["due"], spaceId: string) => {
    const task: DemoTask = { id: `task-${Date.now()}`, titleFa: title, titleEn: title, spaceId, assignedFa: "خودم", assignedEn: "Me", due, done: false, priority: "normal" };
    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  }, []);
  const addExpense = useCallback((title: string, amount: number) => {
    const expense: DemoExpense = { id: `expense-${Date.now()}`, titleFa: title, titleEn: title, amount, currency: "€", paidByFa: "مهدی", paidByEn: "Mahdi", date: new Date().toISOString().slice(0, 10) };
    setData((current) => ({ ...current, expenses: [expense, ...current.expenses] }));
  }, []);
  const reset = useCallback(() => { setData(cloneInitialData()); window.localStorage.removeItem(STORAGE_KEY); }, []);

  const value = useMemo(() => ({ data, ready, createSpace, createList, addItem, editItem, moveItem, toggleItem, removeItem, restoreItem, renameList, deleteList, restoreList, toggleTask, addTask, addExpense, reset }), [data, ready, createSpace, createList, addItem, editItem, moveItem, toggleItem, removeItem, restoreItem, renameList, deleteList, restoreList, toggleTask, addTask, addExpense, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemoData must be used inside DemoDataProvider");
  return context;
}
