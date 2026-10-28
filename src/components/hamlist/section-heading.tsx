import type { ReactNode } from "react";
export function SectionHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-base font-bold text-ink">{title}</h2>{description && <p className="mb-0 text-xs text-muted">{description}</p>}</div>{action}</div>;
}
