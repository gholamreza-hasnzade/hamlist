import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function PageHeader({ eyebrow, title, description, action, badge }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; badge?: string }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div className="min-w-0"><div className="mb-2 flex items-center gap-2">{eyebrow && <p className="mb-0 text-[11px] font-bold tracking-wide text-brand">{eyebrow}</p>}{badge && <Badge variant="neutral">{badge}</Badge>}</div><h1 className="mb-2 text-balance text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">{title}</h1>{description && <p className="mb-0 max-w-2xl text-sm leading-7 text-muted">{description}</p>}</div>
    {action && <div className="shrink-0">{action}</div>}
  </div>;
}
