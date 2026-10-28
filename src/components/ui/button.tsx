import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]", {
  variants: {
    variant: {
      default: "bg-brand text-white shadow-sm hover:bg-brand/90 hover:shadow-md",
      secondary: "border border-line bg-surface text-ink hover:bg-soft",
      ghost: "text-muted hover:bg-soft hover:text-ink",
      outline: "border border-line bg-transparent text-ink hover:bg-soft",
      destructive: "bg-rose-600 text-white hover:bg-rose-700",
      soft: "bg-brand/10 text-brand hover:bg-brand/15",
    },
    size: { default: "h-11 px-4", sm: "h-9 rounded-lg px-3 text-xs", lg: "h-12 rounded-2xl px-5", icon: "size-10 rounded-xl p-0" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});
Button.displayName = "Button";
export { buttonVariants };
