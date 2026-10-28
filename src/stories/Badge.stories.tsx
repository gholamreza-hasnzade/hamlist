import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";
const meta = { title: "UI/Badge", component: Badge, tags: ["autodocs"], args: { children: "Interactive preview" }, argTypes: { variant: { control: "select", options: ["default", "neutral", "success", "warning", "dark"] } } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Violet: Story = { args: { variant: "default" } };
export const Statuses: Story = { render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Badge>Open</Badge><Badge variant="neutral">Sample data</Badge><Badge variant="success">Completed</Badge><Badge variant="warning">Due today</Badge></div> };
