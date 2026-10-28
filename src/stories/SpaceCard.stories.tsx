import type { Meta, StoryObj } from "@storybook/react";
import { LocaleProvider } from "@/providers/locale-provider";
import { SpaceCard } from "@/components/hamlist/space-card";
const sampleSpace = { id: "home", nameFa: "خانه", nameEn: "Home", emoji: "⌂", memberCount: 3, descriptionFa: "کارهای روزمره و خریدهای مشترک", descriptionEn: "Everyday tasks and shared shopping" };
const sampleLists = [{ id: "groceries", spaceId: "home", nameFa: "خرید این هفته", nameEn: "This week’s groceries", emoji: "🛒", kind: "shopping" as const, items: [{ id: "1", titleFa: "نان", titleEn: "Bread", done: true }, { id: "2", titleFa: "قهوه", titleEn: "Coffee", done: false }] }];
const meta = { title: "HamList/SpaceCard", component: SpaceCard, tags: ["autodocs"], args: { space: sampleSpace, lists: sampleLists }, decorators: [(Story) => <LocaleProvider><div style={{ width: 340 }}><Story /></div></LocaleProvider>] } satisfies Meta<typeof SpaceCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HomeSpace: Story = {};
