import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const meta = { title: "UI/Button", component: Button, tags: ["autodocs"], args: { children: "Create a list" }, argTypes: { variant: { control: "select", options: ["default", "secondary", "ghost", "outline", "destructive", "soft"] }, size: { control: "select", options: ["default", "sm", "lg", "icon"] } } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = { args: { children: <><Plus size={16} />Create a list</> } };
export const Secondary: Story = { args: { variant: "secondary", children: <><Share2 size={16} />Invite someone</> } };
export const AllVariants: Story = { render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><Button>Create</Button><Button variant="secondary">Secondary</Button><Button variant="soft">Soft action</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Delete</Button></div> };
