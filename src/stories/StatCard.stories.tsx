import type { Meta, StoryObj } from "@storybook/react";
import { ListTodo } from "lucide-react";
import { StatCard } from "@/components/hamlist/stat-card";
const meta = { title: "HamList/StatCard", component: StatCard, tags: ["autodocs"], args: { label: "Open items", value: 12, note: "Across shared lists", icon: ListTodo } } satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Violet: Story = {};
export const Blue: Story = { args: { tone: "blue", label: "Due today", value: 3 } };
export const Slate: Story = { args: { tone: "slate", label: "Collaborators", value: 8 } };
